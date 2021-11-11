const db = require("../models");
const { validationResult } = require("express-validator");
const HttpException = require("../utils/HttpException.utils");
const pagination = require("../utils/Pagination");
const { getPagination, getPagingData } = pagination;
const saveBase64Image = require("../utils/FileHandler");
const dotenv = require("dotenv");

dotenv.config();

const Brand = db.brands;
const Op = db.Sequelize.Op;

// Create and Save a new Brand
exports.create = (req, res, next) => {
  checkValidation(req);
  let icon = null;
  if (req.body.icon.length) {
    icon = saveBase64Image(
      req.body.icon,
      process.env.BRAND_IMAGE_FOLDER,
      req.body.name
    );
    console.log(icon);
  }

  const brand = {
    name: req.body.name,
    subtitle: req.body.subtitle ?? null,
    icon: icon,
  };
  Brand.create(brand)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

// Retrieve all Brands from the database.
exports.findAll = (req, res) => {
  const conditions = {};
  console.log(req.query);

  if (req.query.id) {
    conditions["id"] = req.query.id;
  }
  if (req.query.name) {
    conditions["name"] = { [Op.like]: `%${req.query.name}%` };
  }
  if (req.query.subtitle) {
    conditions["subtitle"] = { [Op.like]: `%${req.query.subtitle}%` };
  }

  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Brand.findAndCountAll({ where: conditions, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving brands.",
      });
    });
};

// Find a single Brand with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Brand.findByPk(id)
    .then((data) => {
      if (data === null) {
        throw new HttpException(404, "Model not found", req.params);
      }
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({
        message: "Model not found",
      });
    });
};

// Update a Brand by the id in the request
exports.update = (req, res) => {
  checkValidation(req);

  const id = req.params.id;

  const brand = {
    name: req.body.name,
    subtitle: req.body.subtitle ?? null,
    icon: req.body.icon ?? null,
  };
  Brand.update(brand, {
    where: { id: id },
  })
    .then((num) => {
      console.info(num);
      if (num == 1) {
        res.send({ message: "Brand was updated successfully!" });
      } else {
        res
          .status(404)
          .send({ message: "Data could not be updated! Make sure it exists" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Brand with id=" + id,
      });
    });
};

// Delete a Brand with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Brand.destroy({ where: { id: id } })
    .then((num) => {
      console.info(num);
      if (num == 1) {
        res.send({ message: "Brand was deleted successfully!" });
      } else {
        res
          .status(404)
          .send({ message: "Data could not be deleted! Make sure it exists" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Error deleting Brand with id=" + id,
      });
    });
};

// Delete all Brands from the database.
exports.deleteAll = (req, res) => {
  Brand.destroy({ where: {}, truncate: false })
    .then((num) => {
      console.info(num);
      res.send({ message: "All brands were deleted successfully!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Error deleting all brands",
      });
    });
};

checkValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpException(400, "Validation failed", errors);
  }
};
