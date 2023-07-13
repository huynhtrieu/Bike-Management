const ImageFileType = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];

const RegexDownloadURL =
  /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/test-notification-coffee-app\.appspot\.com\/o\/[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\?alt=media&token=[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const role = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const WorkSheet = {
  USER: "USERS",
  PAYMENT: "PAYMENTS",
};
module.exports = {
  ImageFileType,
  RegexDownloadURL,
  role,
  WorkSheet,
};
