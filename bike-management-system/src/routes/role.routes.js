const express = require("express");
const { roleController } = require("../controllers");

const router = express.Router();

router.post("", roleController.createRole);

module.exports = router;
