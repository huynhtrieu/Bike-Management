const httpStatus = require("http-status");

const { cartService } = require("../services");

const getItemInCart = async (req, res) => {
  const cart = await cartService.getCartByUserId(req.user.id);
  return res.send(cart?.bike || []);
};

const addToCart = async (req, res) => {
  const { isError, errorMessage, result } = await cartService.addToCart(
    req.user,
    req.body
  );
  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }
  return res.send(result);
};

const deleteItemInCart = async (req, res) => {
  const deletedList = await cartService.deleteItem(req.params.id, req.user.id);

  return res.send(deletedList);
};

module.exports = {
  getItemInCart,
  addToCart,
  deleteItemInCart,
};
