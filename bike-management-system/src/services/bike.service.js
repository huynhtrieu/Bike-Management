const _ = require("lodash");
const {
  isGreaterThanOrEqual,
  isLowerThanOrEqual,
} = require("../utils/decimal");
const { Bike } = require("../models");
const categoryService = require("./category.service");
const fireBaseService = require("./firebase.service");

const getAll = async (pagination) => {
  const { offset, limit } = pagination;

  const countBikes = await Bike.find().sort({ name: "asc" }).count();
  const bikes = await Bike.find()
    .sort({ name: "asc" })
    .populate("bikeCategory")
    .skip(offset)
    .limit(limit);
  return { bikes, countBikes };
};

const getCountAllItems = async () => {
  const count = (await Bike.find()).length;
  return count;
};

const getAllByCategoryId = async (categoryId) => {
  return Bike.find({
    bikeCategory: categoryId,
  }).populate("bikeCategory");
};

const getById = async (_id) => {
  return Bike.findById(_id).populate("bikeCategory");
};

const getByName = async (name) => {
  return Bike.findOne({ name }).populate("bikeCategory");
};

const searchBikes = async (keyword, body) => {
  try {
    const { search, categoryName, price } = keyword;

    const pagination = {
      limit: parseInt(keyword.limit),
      offset: parseInt(keyword.offset),
    };

    let bikes;
    let countBikes;
    let filterCategory;
    let filterPrice = [];
    let listCategory;
    let listCategoryWithoutNullValue;

    let searchQueryForBikeInformation = !_.isEmpty(body)
      ? convertObjectToSearchKeys(body)
      : null;

    if (categoryName) {
      filterCategory = categoryName.split(",");
      listCategory = await Promise.all(
        filterCategory.map((categoryName) =>
          categoryService.getByName(categoryName)
        )
      );
      listCategoryWithoutNullValue = listCategory.filter(
        (category) => category !== null
      );
      if (listCategoryWithoutNullValue.length === 0) {
        return { isError: true, errorMessage: "Category Not Found" };
      }

      let listCategoryId = listCategoryWithoutNullValue.map(
        (category) => category._id
      );
      if (_.isEmpty(body)) {
        bikes = await Bike.find({
          name: new RegExp(search, "i"),
          bikeCategory: { $in: listCategoryId },
        })
          .populate("bikeCategory")
          // .skip(pagination.offset)
          // .limit(pagination.limit);

        countBikes = await Bike.find({
          name: new RegExp(search, "i"),
          bikeCategory: { $in: listCategoryId },
        });
      } else {
        bikes = await Bike.find({
          name: new RegExp(search, "i"),
          bikeCategory: { $in: listCategoryId },
          ...searchQueryForBikeInformation,
        })
          .populate("bikeCategory")
          // .skip(pagination.offset)
          // .limit(pagination.limit);

        countBikes = await Bike.find({
          name: new RegExp(search, "i"),
          bikeCategory: { $in: listCategoryId },
          ...searchQueryForBikeInformation,
        });
      }

      if (price) {
        filterPrice = price.split(",");
      }

      if (filterPrice.length > 0) {
        bikes = bikes.filter(
          (bike) =>
            isGreaterThanOrEqual(bike.price, filterPrice[0]) &&
            isLowerThanOrEqual(bike.price, filterPrice[1])
        );

        countBikes = countBikes.filter(
          (bike) =>
            isGreaterThanOrEqual(bike.price, filterPrice[0]) &&
            isLowerThanOrEqual(bike.price, filterPrice[1])
        );
      }

      if (Number.isInteger(pagination.offset) && Number.isInteger(pagination.limit)) {
        bikes = bikes.splice(pagination.offset, pagination.limit)
      }

      return {
        isError: false,
        errorMessage: null,
        result: { bikes, countBikes: countBikes.length },
      };
    }

    if (_.isEmpty(body)) {
      bikes = await Bike.find({
        name: new RegExp(search, "i"),
      })
        .populate("bikeCategory")
        // .skip(pagination.offset)
        // .limit(pagination.limit);

      countBikes = await Bike.find({
        name: new RegExp(search, "i"),
      });
    } else {
      bikes = await Bike.find({
        name: new RegExp(search, "i"),
        ...searchQueryForBikeInformation,
      })
        .populate("bikeCategory")
        // .skip(pagination.offset)
        // .limit(pagination.limit);

      countBikes = await Bike.find({
        name: new RegExp(search, "i"),
        ...searchQueryForBikeInformation,
      });
    }

    if (price) {
      filterPrice = price.split(",");
    }

    if (filterPrice.length > 0) {
      bikes = bikes.filter(
        (bike) =>
          isGreaterThanOrEqual(bike.price, filterPrice[0]) &&
          isLowerThanOrEqual(bike.price, filterPrice[1])
      );
      countBikes = countBikes.filter(
        (bike) =>
          isGreaterThanOrEqual(bike.price, filterPrice[0]) &&
          isLowerThanOrEqual(bike.price, filterPrice[1])
      );
    }

    if (Number.isInteger(pagination.offset) && Number.isInteger(pagination.limit)) {
      bikes = bikes.splice(pagination.offset, pagination.limit)
    }


    return {
      isError: false,
      errorMessage: null,
      result: { bikes, countBikes: countBikes.length },
    };
  } catch (error) {
    return { isError: true, errorMessage: error };
  }
};

const createBike = async (data, image) => {
  try {
    const { categoryName, name } = data;

    const bike = await getByName(name);
    if (bike) {
      return {
        isError: true,
        errorMessage: "Duplicated bike",
        result: null,
      };
    }

    const category = await categoryService.getByName(categoryName);
    if (!category) {
      return {
        isError: true,
        errorMessage: "Category not found",
        result: null,
      };
    }

    const fileUrls = await Promise.all(
      image.map((img) => fireBaseService.storeFile(img))
    );
    const creatingBike = {
      ...data,
      bikeCategory: category._id,
      image: fileUrls,
      quantity: data.quantity.toString(),
    };

    const bikeCreated = await Bike.create(creatingBike);
    return {
      isError: false,
      errorMessage: null,
      result: bikeCreated,
    };
  } catch (error) {
    return {
      isError: true,
      errorMessage: error.message,
      result: null,
    };
  }
};

const updateBikeImage = async (body, images) => {
  const { bikeId, imageList } = body;
  try {
    const bike = await getById(bikeId);
    if (!imageList && (!images || images.length === 0)) {
      Object.assign(bike, {
        image: [],
      });
      await bike.save();

      return {
        isError: false,
        errorMessage: null,
        result: bike,
      };
    }

    // Case2: add image when bike no image before
    if (!imageList && images.length > 0) {
      const fileUrls = await Promise.all(
        images.map((img) => fireBaseService.storeFile(img))
      );
      Object.assign(bike, {
        image: [...fileUrls],
      });
      await bike.save();

      return {
        isError: false,
        errorMessage: null,
        result: bike,
      };
    }

    // Case 1: no upload any image
    if (imageList.length === bike.image.length && images.length === 0) {
      return {
        isError: false,
        errorMessage: null,
        result: bike,
      };
    }

    // add image
    if (images.length !== 0) {
      const fileUrls = await Promise.all(
        images.map((img) => fireBaseService.storeFile(img))
      );
      Object.assign(bike, {
        image: [...imageList, ...fileUrls],
      });
      await bike.save();

      return {
        isError: false,
        errorMessage: null,
        result: bike,
      };
    }

    // delete image
    Object.assign(bike, {
      image: [...imageList],
    });
    await bike.save();

    return {
      isError: false,
      errorMessage: null,
      result: bike,
    };
  } catch (error) {
    return {
      isError: true,
      errorMessage: error.message,
      result: null,
    };
  }
};

const updateBikeInformation = async (payload) => {
  try {
    const bike = await getById(payload.bikeId);

    if (payload.name) {
      const bike = await getByName(payload.name.toString());
      if (bike && bike.name !== payload.name) {
        return {
          isError: true,
          errorMessage: "Duplicated bike name",
          result: null,
        };
      }
    }

    if (
      payload.categoryName &&
      payload.categoryName !== bike.bikeCategory.name
    ) {
      const category = await categoryService.getByName(payload.categoryName);
      Object.assign(payload, { bikeCategory: category._id });
    }

    delete payload.categoryName;
    Object.assign(bike, payload);

    await bike.save();

    return { isError: null, errorMessage: null, result: bike };
  } catch (error) {
    return {
      isError: true,
      errorMessage: error.message,
      result: null,
    };
  }
};

const deleteBike = async (id) => {
  try {
    await Bike.findByIdAndDelete(id);
    return { isError: false, errorMessage: null, result: null };
  } catch (error) {
    return {
      isError: true,
      errorMessage: error.message,
      result: null,
    };
  }
};

function convertObjectToSearchKeys(obj, parentKey = "") {
  let searchKeys = {};

  for (let key in obj) {
    const currentKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof obj[key] === "object" && obj[key] !== null) {
      const nestedKeys = convertObjectToSearchKeys(obj[key], currentKey);
      Object.assign(searchKeys, nestedKeys);
    } else {
      const value = obj[key];
      searchKeys[currentKey] = value;
    }
  }

  return searchKeys;
}

module.exports = {
  getAll,
  getAllByCategoryId,
  getCountAllItems,
  getById,
  searchBikes,
  createBike,
  updateBikeImage,
  updateBikeInformation,
  deleteBike,
};
