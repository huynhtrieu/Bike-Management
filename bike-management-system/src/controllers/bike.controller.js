const { bikeService } = require("../services");
const { ImageFileType } = require("../constanst");
const httpStatus = require("http-status");

const getAll = async (req, res) => {
  const pagination = {
    limit: parseInt(req.query.limit),
    offset: parseInt(req.query.offset),
  };
  const bikes = await bikeService.getAll(pagination);
  res.send({ ...bikes });
};

const getCountAllBikes = async (req, res) => {
  const count = await bikeService.getCountAllItems();
  return res.send({ count });
};

const getById = async (req, res) => {
  const id = req.params.id;
  const bike = await bikeService.getById(id);
  res.send(bike);
};

const getByCategoryId = async (req, res) => {
  const categoryId = req.params.id;
  const bike = await bikeService.getAllByCategoryId(categoryId);
  res.send(bike);
};

const searchBikes = async (req, res) => {
  const { isError, errorMessage, result } = await bikeService.searchBikes(
    req.query,
    req.body
  );
  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: errorMessage,
    });
  }

  return res.send({ ...result });
};

const createBike = async (req, res) => {
  const { body } = req;
  const data = JSON.parse(JSON.stringify(req.body));

  const images = req.files;
  let isInvalidFileType = false;
  for (let i = 0; i < images.length; i++) {
    if (!ImageFileType.includes(images[i]?.mimetype)) {
      isInvalidFileType = true;
      break;
    }
  }
  if (isInvalidFileType) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Invalid file type",
    });
  }

  const {
    isError,
    errorMessage,
    result: bike,
  } = await bikeService.createBike(data, images);
  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }

  return res.send(bike);
};

const updateBikeImage = async (req, res) => {
  const { body } = req;

  const images = req.files;

  const {
    isError,
    errorMessage,
    result: bike,
  } = await bikeService.updateBikeImage(body, images);

  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }

  return res.send(bike);
};

const updateBikeInformation = async (req, res) => {
  const {
    isError,
    errorMessage,
    result: bike,
  } = await bikeService.updateBikeInformation(req.body);

  if (isError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }

  return res.send(bike);
};

const deleteBike = async (req, res) => {
  const { isError, errorMessage, result } = await bikeService.deleteBike(
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
  getByCategoryId,
  getCountAllBikes,
  searchBikes,
  createBike,
  updateBikeImage,
  updateBikeInformation,
  deleteBike,
};
