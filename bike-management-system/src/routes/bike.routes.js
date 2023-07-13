const express = require("express");
const { bikeController } = require("../controllers");
const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

const router = express.Router();

router.get("/", bikeController.getAll);
router.get("/count", bikeController.getCountAllBikes);
router.get("/search", bikeController.searchBikes);
router.get("/:id", bikeController.getById);
router.get("/category/:id", bikeController.getByCategoryId);

router.post("/", upload.array("file"), bikeController.createBike);

router.patch("/", bikeController.updateBikeInformation);
router.patch("/image", upload.array("file"), bikeController.updateBikeImage);

router.delete("/:id", bikeController.deleteBike);
module.exports = router;
