const express = require("express");
const Expense = require("./expense.model");
const auth = require("../../config/auth/jwt.auth");
const { ObjectID } = require("mongodb");

const router = express.Router();

const URL = "/v1/expense";

/**
 * Save new expense.
 */
router.post(`${URL}`, auth, async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const saved = await expense.save();
    res.status(201).send({ detail: saved });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Update an expense.
 */
router.patch(`${URL}`, auth, async (req, res) => {
  try {
    const id = req.body.id;
    const expense = await Expense.findByIdAndUpdate(id, req.body);
    res.status(200).send({ detail: expense });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Get all expenses.
 */
router.get(`${URL}/all`, auth, async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("category")
      .populate("paymentMethod")
      .populate("status");
    res.status(200).send({ detail: expenses });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Delete an expense
 */
router.delete(`${URL}/:id`, auth, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  try {
    const obj = await Expense.findOneAndDelete({
      _id: id
    });
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
 * Get Pageable of Expenses.
 * @param `page`, `size` request parameters.
 */
router.get(`${URL}/list`, auth, async (req, res) => {
  const page = req.query.page;
  const size = req.query.size;
  const skips = size * (page - 1);
  try {
    const expenses = await Expense.find()
      .skip(skips)
      .limit(Number(size));
    const totalElementsCount = await Expense.countDocuments();
    res.status(200).send({
      detail: {
        content: expenses,
        totalElements: totalElementsCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

module.exports = router;
