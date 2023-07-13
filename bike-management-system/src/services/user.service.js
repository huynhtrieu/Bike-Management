const { User } = require("../models");
const cartService = require("./cart.service");
const roleService = require("./role.service");
const fireBaseService = require("./firebase.service");

const getUserByEmail = async (email) => {
  return User.findOne({ email }).populate("roleId");
};

const getAllUser = async (pagination) => {
  const { offset, limit } = pagination;

  const userRole = await roleService.findRoleByName("user");
  const countProfile = await User.count();
  const listProfile = await User.find({ roleId: userRole._id })
    .populate("roleId")
    .skip(offset)
    .limit(limit);
  return { countProfile, listProfile };
};

const createUser = async (userBody) => {
  try {
    if (await User.isEmailTaken(userBody.email)) {
      return {
        isError: true,
        errorMessage: "Email is registered",
        result: null,
      };
    }

    const roleName = userBody.roleName ?? "user";
    const role = await roleService.findRoleByName(roleName);

    const requestCreateUser = {
      ...userBody,
      roleId: role._id,
    };

    const user = await User.create(requestCreateUser);

    await cartService.createCart(user.id);

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

const updateProfile = async (user, payload, image) => {
  let payloadUpdateProfile = { ...payload };
  if (image) {
    const fileUrl = await fireBaseService.storeFile(image);
    payloadUpdateProfile = {
      ...payloadUpdateProfile,
      image: fileUrl,
    };
  }
  return User.findByIdAndUpdate(user._id, payloadUpdateProfile, {
    returnOriginal: false,
  });
};

const updatePassword = async (user, payload) => {
  try {
    const { newPassword, currentPassword } = payload;

    if (!(await user.isPasswordMatch(currentPassword))) {
      return { isError: true, errorMessage: "Invalid passowrd", result: null };
    }

    const newPasswordUpdate = {
      password: newPassword,
    };

    Object.assign(user, newPasswordUpdate);
    await user.save();
    return { isError: false, errorMessage: null };
  } catch (error) {
    return { isError: true, errorMessage: error.message, result: null };
  }
};

const deleteUser = async (id) => {
  try {
    await User.findByIdAndDelete(id);
    return { isError: false, errorMessage: null, result: null };
  } catch (error) {
    return {
      isError: true,
      errorMessage: error.message,
      result: null,
    };
  }
};

const searchUser = async (query) => {
  const { search } = query;

  const pagination = {
    limit: parseInt(query.limit),
    offset: parseInt(query.offset),
  };

  const userRole = await roleService.findRoleByName("user");

  const countUsers = await User.find({
    $and: [
      { roleId: userRole._id },
      {
        $or: [
          {
            name: new RegExp(search, "i"),
          },
          {
            email: new RegExp(search, "i"),
          },
        ],
      },
    ],
  }).count();

  const users = await User.find({
    $and: [
      { roleId: userRole._id },
      {
        $or: [
          {
            name: new RegExp(search, "i"),
          },
          {
            email: new RegExp(search, "i"),
          },
        ],
      },
    ],
  })
    .skip(pagination.offset)
    .limit(pagination.limit);

  return { isError: false, errorMessage: null, result: { users, countUsers } };
};

module.exports = {
  getAllUser,
  getUserByEmail,
  createUser,
  updateProfile,
  updatePassword,
  deleteUser,
  searchUser,
};
