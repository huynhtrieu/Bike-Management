const express = require("express");
const authRoute = require("./auth.routes");
const roleRoute = require("./role.routes");
const categoryRoute = require("./category.routes");
const bikeRoute = require("./bike.routes");
const userRoute = require("./user.routes");
const cartRoute = require("./cart.routes");
const paymentRoute = require("./payment.routes");

const config = require("../config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/roles",
    route: roleRoute,
  },
  {
    path: "/categories",
    route: categoryRoute,
  },
  {
    path: "/bikes",
    route: bikeRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/payments",
    route: paymentRoute,
  },
  {
    path: "/carts",
    route: cartRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
