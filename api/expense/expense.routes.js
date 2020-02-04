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
    await expense.save();
    res.status(201).send({ expense: expense });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

/**
 * Update an expense.
 */
router.patch(`${URL}`, auth, async (req, res) => {
  try {
    const id = req.body._id;
    const expense = await Expense.findOneAndUpdate(id, req.body);
    res.status(200).send({ expense: expense });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

/**
 * Get all expenses.
 */
router.get(`${URL}/all`, auth, async (req, res) => {
  try {
    const expenses = await Expense.find({})
      .populate("category")
      .populate("paymentMethod")
      .populate("status");
    res.status(200).send({ expenses: expenses });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
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
    res.status(200).send(obj);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

module.exports = router;
