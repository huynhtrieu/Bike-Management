const express = require("express");
const { paymentController } = require("../controllers");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth(["admin"]), paymentController.getAllPaymentTransactions);
router.get(
  "/history-payment",
  auth(["user"]),
  paymentController.getPaymentHistory
);
router.get("/download", paymentController.downloadExcel);
router.get("/best-sellers", paymentController.getBestSellerItem);
router.get("/redirect", paymentController.redirectPayment);
router.get("/:id", auth(["user"]), paymentController.getPaymentTransaction);

router.post("/", auth(["user"]), paymentController.createPayment);
router.post("/carts", auth(["user"]), paymentController.createPaymentByCarts);

module.exports = router;
