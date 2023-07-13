const express = require("express");
const { categoryController } = require("../controllers");

const router = express.Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.get("/name/:name", categoryController.getByName);

router.post("/", categoryController.createCategory);

router.patch("/:id", categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);
module.exports = router;
