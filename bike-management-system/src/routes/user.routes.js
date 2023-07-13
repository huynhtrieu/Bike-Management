const express = require("express");
const { userController } = require("../controllers");
const auth = require("../middlewares/auth");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

router.get("/profile", auth(["admin", "user"]), userController.getProfile);
router.get("/all-profile", auth(["admin"]), userController.getAllProfile);
router.get("/search", auth(["admin"]), userController.searchUser);
router.get("/download", userController.downloadExcel);

router.patch(
  "/profile",
  auth(["admin", "user"]),
  upload.single("file"),
  userController.updateProfile
);

router.patch(
  "/profile/password",
  auth(["admin", "user"]),
  userController.updatePassword
);

router.delete("/:id", auth(["admin"]), userController.deleteUser);
module.exports = router;
