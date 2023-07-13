const { paymentService } = require("../services");
const httpStatus = require("http-status");
const { config } = require("../config");
const excel = require("exceljs");
const { WorkSheet } = require("../constanst");
const { formatDate } = require("../utils/date-time");
const currencyFormatter = require("currency-formatter");

const getAllPaymentTransactions = async (req, res) => {
  const pagination = {
    limit: parseInt(req.query.limit),
    offset: parseInt(req.query.offset),
  };

  const transactions = await paymentService.getAll(pagination);

  res.send({ ...transactions });
};

const getPaymentTransaction = async (req, res) => {
  const transaction = await paymentService.getPaymentTransaction(req.params.id);
  return res.send(transaction);
};

const getPaymentHistory = async (req, res) => {
  const pagination = {
    limit: parseInt(req.query.limit),
    offset: parseInt(req.query.offset),
  };
  const transaction = await paymentService.getPaymentHistory(
    req.user,
    pagination
  );

  return res.send({ ...transaction });
};

const downloadExcel = async (req, res) => {
  const pagination = {
    limit: parseInt(req.query.limit),
    offset: parseInt(req.query.offset),
  };

  const allPayments = await paymentService.getAll(pagination);
  const mapPaymentsData = [];
  allPayments.payments.forEach((payment) => {
    return payment.items.forEach((item) => {
      mapPaymentsData.push({
        user: payment?.user?.name ?? "null",
        bike: item?.bike?.name ?? "null",
        quantity: item.quantity,
        amount: payment.amount,
        description: payment.description,
        payDate: payment.payDate ? formatDate(payment.payDate) : "Not pay",
      });
    });
  });

  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet(WorkSheet.PAYMENT);

  worksheet.columns = [
    { header: "Name", key: "user", width: 15 },
    { header: "Bike", key: "bike", width: 15 },
    { header: "Quantity", key: "quantity", width: 15 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Description", key: "description", width: 15 },
    { header: "Pay Date", key: "payDate", width: 15 },
  ];
  // worksheet.addRows(mapDataFordownloadExcel)
  mapPaymentsData.forEach((dataExcel) => {
    worksheet.addRow(dataExcel);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=payment.xlsx");

  // Send the workbook as a response
  workbook.xlsx
    .write(res)
    .then(() => {
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error generating Excel file");
    });
};

const createPayment = async (req, res) => {
  const { isError, errorMessage, result } = await paymentService.createPayment(
    req
  );
  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }

  const { redirectLink } = result;

  res.status(200).send({
    redirectLink,
  });
};

const redirectPayment = async (req, res) => {
  const payloadRedirectPayment = req.query;

  const {
    isError,
    errorMessage,
    result: paymentTransaction,
  } = await paymentService.handleRedirectPayment(payloadRedirectPayment);

  if (isError) {
    return res.render("error");
  }

  const amount = currencyFormatter.format(paymentTransaction.amount, {
    code: "VND",
  });
  const dataTransaction = {
    amount: `${amount}`,
    payDate: formatDate(paymentTransaction.payDate),
    transactionUid: paymentTransaction._id,
  };

  return res.render("index", dataTransaction);
};

const getBestSellerItem = async (req, res) => {
  const { isError, errorMessage, result } =
    await paymentService.getBestSellerItem();
  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }
  return res.send(result);
};

const createPaymentByCarts = async (req, res) => {
  const { isError, errorMessage, result } =
    await paymentService.createPaymentByCarts(req);
  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }

  const { redirectLink } = result;

  res.status(200).send({
    redirectLink,
  });
};

module.exports = {
  getPaymentHistory,
  getAllPaymentTransactions,
  getPaymentTransaction,
  downloadExcel,
  createPayment,
  redirectPayment,
  getBestSellerItem,
  createPaymentByCarts,
};
