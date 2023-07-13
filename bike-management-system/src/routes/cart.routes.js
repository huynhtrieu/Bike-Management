const express = require("express");
const { cartController } = require("../controllers");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth(["user"]), cartController.getItemInCart);

router.post("/", auth(["user"]), cartController.addToCart);

router.delete("/:id", auth(["user"]), cartController.deleteItemInCart);

module.exports = router;
