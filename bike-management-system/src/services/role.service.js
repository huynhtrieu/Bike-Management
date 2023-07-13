const { Role, User } = require("../models");

const createRole = async (role) => {
  return Role.create(role);
};

const findRoleByName = async (name) => {
  return Role.findOne({ name });
};

module.exports = {
  createRole,
  findRoleByName,
};
