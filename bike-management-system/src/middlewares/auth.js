const passport = require("passport");
const httpStatus = require("http-status");
const { role } = require("../constanst");

const verifyCallback =
  (req, resolve, reject, role) => async (err, user, info) => {
    if (err || info || !user) {
      return reject({
        status: httpStatus.UNAUTHORIZED,
        message: "Please authenticate",
      });
    }

    req.user = user;

    if (!role.includes(user.roleId.name)) {
      reject({ status: httpStatus.FORBIDDEN, message: "Forbidden" });
    }

    resolve();
  };

const auth = (role) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject, role)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => {
      return res.status(err.status).send({ message: err.message });
    });
};

module.exports = auth;
