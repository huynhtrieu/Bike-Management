const moment = require("moment");
const { config, token } = require("../config");
const jwt = require("jsonwebtoken");
const userService = require("./user.service");

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.EXPIRE_TOKEN, "minutes");
  const accessToken = generateToken(user.id, accessTokenExpires, token.ACCESS);

  const refreshTokenExpires = moment().add(config.REFRESH_TOKEN, "days");
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    token.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const loginUserWithEmailAndPassword = async (email, password) => {
  try {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      return {
        isError: true,
        errorMessage: "Email or Password is invalid",
        result: null,
      };
    }
    return {
      isError: false,
      errorMessage: null,
      result: user,
    };
  } catch (error) {
    return {
      isError: true,
      errorMessage: error,
      result: null,
    };
  }
};

const generateToken = (userId, expires, type, secret = config.JWT_SECRET) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

module.exports = {
  generateAuthTokens,
  loginUserWithEmailAndPassword,
};
