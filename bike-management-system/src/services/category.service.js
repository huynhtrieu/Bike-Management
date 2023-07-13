const { Category, Bike } = require("../models");

const getAll = (pagination) => {
  const { offset, limit } = pagination;
  return Category.find().sort({ name: "asc" }).skip(offset).limit(limit);
};

const getByName = (name) => {
  return Category.findOne({ name });
};

const getById = (_id) => {
  return Category.findById(_id);
};

const createCategory = (category) => {
  return Category.create(category);
};

const updateCategory = async (id, payload) => {
  const category = await Category.findById(id);
  Object.assign(category, payload);

  await category.save();

  return category;
};

const deleteCategory = async (id) => {
  try {
    await Category.findByIdAndDelete(id);
    await Bike.deleteMany({ bikeCategory: id });

    return { isError: false, errorMessage: null, result: null };
  } catch (error) {
    return {
      isError: true,
      errorMessage: error.message,
      result: null,
    };
  }
};

module.exports = {
  getAll,
  getByName,
  getById,
  createCategory,
  updateCategory,
  deleteCategory,
};
