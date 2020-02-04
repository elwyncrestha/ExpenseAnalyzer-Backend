const express = require("express");
const Category = require("./category.model");
const auth = require("../../config/auth/jwt.auth");

const router = express.Router();

const URL = "/v1/category";

/**
 * Save new category.
 */
router.post(`${URL}`, auth, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).send({ category });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

/**
 * Update a category.
 */
router.patch(`${URL}`, auth, async (req, res) => {
  try {
    const id = req.body._id;
    console.log(req.body);
    const category = await Category.findOneAndUpdate(id, req.body);
    res.status(200).send({ category });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

module.exports = router;
