const express = require("express");
const Category = require("./category.model");
const auth = require("../../config/auth/jwt.auth");
const { ObjectID } = require("mongodb");
const audit = require("../../config/audit/createdby.audit");

const router = express.Router();

const URL = "/v1/category";

/**
 * Save new category.
 */
router.post(`${URL}`, auth, audit, async (req, res) => {
  try {
    const category = new Category(req.body);
    const saved = await category.save();
    res.status(201).send({ detail: saved });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Update a category.
 */
router.patch(`${URL}`, auth, async (req, res) => {
  try {
    const id = req.body.id;
    const category = await Category.findByIdAndUpdate(id, req.body);
    res.status(200).send({ detail: category });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Get all categories.
 */
router.get(`${URL}/all`, auth, async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send({ detail: categories });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Get all categories with search.
 */
router.post(`${URL}/all`, auth, async (req, res) => {
  try {
    const categories = await Category.find(req.body);
    res.status(200).send({ detail: categories });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Delete a category
 */
router.delete(`${URL}/:id`, auth, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  try {
    const obj = await Category.findOneAndDelete({ _id: id });
    if (!obj) {
      return res.status(404).send();
    }
    res.status(200).send({ detail: obj });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error });
  }
});

/**
 * Get Pageable of Category.
 * @param `page`, `size` request parameters.
 */
router.get(`${URL}/list`, auth, async (req, res) => {
  const page = req.query.page;
  const size = req.query.size;
  const skips = size * (page - 1);
  try {
    const categories = await Category.find()
      .skip(skips)
      .limit(Number(size));
    const totalElementsCount = await Category.countDocuments();
    res.status(200).send({
      detail: {
        content: categories,
        totalElements: totalElementsCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Get status count of categories.
 */
router.get(`${URL}/status-count`, auth, async (req, res) => {
  try {
    const expenseCount = await Category.countDocuments({ type: 0 });
    const incomeCount = await Category.countDocuments({ type: 1 });
    res.status(200).send({
      detail: { incomeCount: incomeCount, expenseCount: expenseCount }
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

module.exports = router;
