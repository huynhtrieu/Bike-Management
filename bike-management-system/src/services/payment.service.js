const moment = require("moment");
const { Payment } = require("../models");
const { bikeService } = require("../services");
const Decimal = require("decimal.js");
const cartService = require("./cart.service");

const getAll = async (pagination) => {
  const { offset, limit } = pagination;
  const countPayments = await Payment.find().sort({ payDate: "desc" }).count();
  const payments = await Payment.find()
    .populate("user")
    .sort({ payDate: "desc" })
    .skip(offset)
    .limit(limit);

  for (let i = 0; i < payments.length; i++) {
    const payment = payments[i];

    for (let j = 0; j < payment.items.length; j++) {
      await payment.populate(`items.${j}.bike`);
    }
  }

  return { payments, countPayments };
};

const getPaymentHistory = async (userId, pagination) => {
  const { offset, limit } = pagination;
  const countPayments = await Payment.find({ user: userId }).count();
  const payments = await Payment.find({ user: userId })
    .populate("user")
    .sort({ payDate: "desc" })
    .skip(offset)
    .limit(limit);

  for (let i = 0; i < payments.length; i++) {
    const payment = payments[i];

    for (let j = 0; j < payment.items.length; j++) {
      await payment.populate(`items.${j}.bike`);
    }
  }

  return { payments, countPayments };
};

const getPaymentTransaction = async (id) => {
  return Payment.findById(id);
};

const createPayment = async (req) => {
  const { user, body } = req;
  try {
    const bike = await bikeService.getById(body.bikeId);
    if (!bike) {
      return {
        isError: true,
        errorMessage: "Bike not found",
        result: null,
      };
    }
    const quantityBike = new Decimal(bike.quantity);
    const quantityPayment = new Decimal(body.quantity);
    const amountPayment = quantityPayment.mul(new Decimal(bike.price));

    if (quantityPayment.greaterThan(quantityBike)) {
      return {
        isError: true,
        errorMessage: "Payment error due to quantity of payment",
        result: null,
      };
    }

    const items = [
      {
        bike: bike._id,
        quantity: body.quantity,
      },
    ];

    const paymentObj = {
      user: user._id,
      items,
      quantity: body.quantity,
      amount: amountPayment,
      description: body.description || "",
      payStatus: "N",
      payDate: "",
    };
    const payment = await Payment.create(paymentObj);

    const redirectLink = handleCreatePaymentLink(req, payment);

    return {
      isError: false,
      errorMessage: null,
      result: {
        payment,
        redirectLink,
      },
    };
  } catch (error) {
    return {
      isError: true,
      errorMessage: error.message,
      result: null,
    };
  }
};

const createPaymentByCarts = async (req) => {
  const { user, body } = req;
  try {
    const listCart = await Promise.all(
      body.carts.map((cartId) => cartService.getCartById(user, cartId))
    );

    let amountPayment = new Decimal("0");
    let items = [];
    listCart.forEach((cartItem) => {
      const { bike, quantity } = cartItem;
      const quantityPayment = new Decimal(quantity);

      amountPayment = amountPayment.plus(
        quantityPayment.mul(new Decimal(bike.price))
      );
      items.push({
        bike: bike._id,
        quantity: quantity,
      });
    });

    const paymentObj = {
      user: user._id,
      items,
      amount: amountPayment,
      description: body.description || "",
      payStatus: "N",
      payDate: "",
    };
    const payment = await Payment.create(paymentObj);
    const redirectLink = handleCreatePaymentLink(req, payment);

    for (let i = 0; i < body.carts.length; i++) {
      await cartService.deleteItem(body.carts[i], user._id);
    }

    return {
      isError: false,
      errorMessage: null,
      result: {
        payment,
        redirectLink,
      },
    };
  } catch (error) {
    return {
      isError: true,
      errorMessage: error.message,
      result: null,
    };
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const handleRedirectPayment = async (payload) => {
  try {
    const {
      vnp_TxnRef,
      vnp_Amount,
      vnp_ResponseCode,
      vnp_PayDate,
      vnp_TransactionStatus,
    } = payload;
    const paymentTransaction = await getPaymentTransaction(vnp_TxnRef);

    let listOfBikePaid = [];
    for (let i = 0; i < paymentTransaction.items.length; i++) {
      await paymentTransaction.populate(`items.${i}.bike`);

      listOfBikePaid.push({
        quantity: (
          parseInt(paymentTransaction.items[i].bike.quantity) -
          parseInt(paymentTransaction.items[i].quantity)
        ).toString(),
        bikeId: paymentTransaction.items[0].bike._id.toString(),
      });
    }

    const updatedForPayment = {
      amount: vnp_Amount / 100,
      payStatus: vnp_TransactionStatus === "00" ? "Y" : "N",
      payDate: vnp_PayDate,
    };
    const updatedPayment = await updatePayment(
      paymentTransaction,
      updatedForPayment
    );

    if (vnp_ResponseCode !== "00") {
      return {
        isError: true,
        errorMessage: "Error when handle payment transaction",
        result: null,
      };
    }

    await Promise.all(
      listOfBikePaid.map((bike) => bikeService.updateBikeInformation(bike))
    );

    const transactionUpdated = await getPaymentTransaction(vnp_TxnRef);

    return {
      isError: false,
      errorMessage: null,
      result: transactionUpdated,
    };
  } catch (error) {
    return {
      isError: true,
      errorMessage: "Error when handling payment redirect",
      result: null,
    };
  }
};

const updatePayment = async (payment, payload) => {
  Object.assign(payment, payload);
  await Payment.findOneAndUpdate({ _id: payment._id }, payload);

  return payment;
};

const handleCreatePaymentLink = (req, payment) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // let config = require('config');

  let tmnCode = "MFLA9W79";
  let secretKey = "LJPHSEUQDVWXRMWJSJZDMXNFJVHRIRWR";
  let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  let returnUrl = "http://localhost:8080/api/payments/redirect";
  let orderId = payment._id;
  let amount = payment.amount;

  let bankCode = "";

  let locale = "vn";

  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  return vnpUrl;
};

const getBestSellerItem = async () => {
  const { payments, countPayments } = await getAll({ offset: 0, limit: 0 });

  const listDuplicateBike = {};

  for (let i = 0; i < payments.length; i++) {
    const payment =payments[i]
    for (let j = 0; j < payment.items.length; j++) {
      const item = payment.items[j]
      if(item.bike) {
        listDuplicateBike[item.bike._id.toString()] = listDuplicateBike[
            item.bike._id.toString()
            ]
            ? parseInt(listDuplicateBike[item.bike._id.toString()]) + parseInt(item.quantity)
            : parseInt(item.quantity);
      }
    }
  }

  const itemsArray = [];
  for (item in listDuplicateBike) {
    const quantity = listDuplicateBike[item];
    itemsArray.push({ item, quantity });
  }

  itemsArray.sort((a, b) => b.quantity - a.quantity);

  const itemSliceFirstTenItem = itemsArray.slice(0, 10);

  const listBestSeller = await Promise.all(
    itemSliceFirstTenItem.map((bike) => bikeService.getById(bike.item))
  );

  return { isError: false, errorMessage: null, result: listBestSeller };
};

module.exports = {
  getAll,
  getPaymentTransaction,
  getPaymentHistory,
  getBestSellerItem,
  createPayment,
  handleRedirectPayment,
  createPaymentByCarts,
};
