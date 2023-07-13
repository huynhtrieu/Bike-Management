const { roleService } = require("../services");
const httpStatus = require("http-status");

const createRole = async (req, res) => {
  const roles = await roleService.createRole(req.body);
  res.status(httpStatus.CREATED).send({ roles });
};

module.exports = {
  createRole,
};
