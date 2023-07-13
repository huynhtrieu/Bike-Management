const { categoryService } = require("../services");
const httpStatus = require("http-status");

const getAll = async (req, res) => {
  const pagination = {
    limit: parseInt(req.query.limit),
    offset: parseInt(req.query.offset),
  };
  const category = await categoryService.getAll(pagination);
  res.send(category);
};

const getById = async (req, res) => {
  const id = req.params.id;
  const category = await categoryService.getById(id);
  res.send(category);
};

const getByName = async (req, res) => {
  const name = req.params.name;
  const category = await categoryService.getByName(name);
  res.send(category);
};

const createCategory = async (req, res) => {
  const { body } = req;

  const categoryCreated = await categoryService.getByName(body.name);
  if (categoryCreated) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "Category already existed" });
  }

  const category = await categoryService.createCategory(body);

  return res.send({
    category,
  });
};

const updateCategory = async (req, res) => {
  const updatedCategory = await categoryService.updateCategory(
    req.params.id,
    req.body
  );

  res.send(updatedCategory);
};

const deleteCategory = async (req, res) => {
  const { isError, errorMessage } = await categoryService.deleteCategory(
    req.params.id
  );
  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }

  return res.send({ message: "OK" });
};

module.exports = {
  getAll,
  getById,
  getByName,
  createCategory,
  updateCategory,
  deleteCategory,
};
