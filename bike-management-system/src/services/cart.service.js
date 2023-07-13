const bikeService = require("./bike.service");
const { Cart } = require("../models");
const Decimal = require("decimal.js");

const getCartByUserId = async (userId) => {
  let cart;
  cart = await Cart.findOne({
    user: userId,
  }).populate(["bike.bike", "user"]);

  if (!cart) {
    cart = await createCart(userId);
  }

  cart.bike = cart.bike.filter(bik => bik.bike !== null)

  for (let i = 0; i < cart.bike.length; i++) {
    if (cart.bike[i].bike) {
      cart.bike[i].bike = await cart.bike[i].bike.populate("bikeCategory");
    }

  }

  return cart;
};

const getCartItemsById = async (userId, cartItemId) => {
  const cart = await getCartByUserId(userId);
  const cartFilter = cart.bike.find(
    (bike) => bike._id.toString() === cartItemId
  );

  return cartFilter;
};

const createCart = async (userId) => {
  const cart = await Cart.create({
    user: userId,
  });

  return cart;
};

const addToCart = async (user, payload) => {
  const { bikeId } = payload;
  const quantity = +payload.quantity || 1;
  const bike = await bikeService.getById(bikeId);
  if (!bike) {
    return { isError: true, errorMessage: "Bike is not existed", result: null };
  }

  const quantityBike = new Decimal(bike.quantity);
  const quantityPayment = new Decimal(quantity);

  if (quantityPayment.greaterThan(quantityBike)) {
    return {
      isError: true,
      errorMessage: "Payment error due to quantity of payment",
      result: null,
    };
  }

  const userId = user.id;

  let cart;

  cart = await getCartByUserId(userId);
  if (!cart) {
    cart = await createCart(userId);
  }

  const itemExistedInCart = cart.bike.find(
    (cartItem) => cartItem.bike._id.toString() === bikeId
  );
  if (itemExistedInCart) {
    const quantityPayment = itemExistedInCart.quantity + parseInt(quantity);
    if (quantityPayment > parseInt(bike.quantity)) {
      return {
        isError: true,
        errorMessage: "Payment error due to quantity of payment",
        result: null,
      };
    }
    cart.bike.forEach((cartItem, index) => {
      if (cartItem.bike._id.toString() === bikeId) {
        cart.bike[index].quantity += quantity;
      }
    });
    const newCart = await cart.save();
    return { isError: false, errorMessage: null, result: newCart };
  }

  cart.bike.push({
    bike: bikeId,
    quantity,
  });

  const newCart = await cart.save();
  return { isError: false, errorMessage: null, result: newCart };
};

const deleteItem = async (id, userId) => {
  const cart = await getCartByUserId(userId);
  cart.bike = cart.bike.filter((bike) => bike._id.toString() !== id);
  await cart.save();
  return cart;
};

module.exports = {
  addToCart,
  getCartByUserId,
  getCartById: getCartItemsById,
  createCart,
  deleteItem,
};
