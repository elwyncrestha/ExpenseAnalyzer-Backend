const express = require("express");
const ExpenseStatus = require("./expensestatus.model");
const auth = require("../../config/auth/jwt.auth");
const { ObjectID } = require("mongodb");

const router = express.Router();

const URL = "/v1/expense-status";

/**
 * Save new expense status.
 */
router.post(`${URL}`, auth, async (req, res) => {
  try {
    const expenseStatus = new ExpenseStatus(req.body);
    const saved = await expenseStatus.save();
    res.status(201).send({ detail: saved });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Update an expense status.
 */
router.patch(`${URL}`, auth, async (req, res) => {
  try {
    const id = req.body._id;
    const expenseStatus = await ExpenseStatus.findByIdAndUpdate(id, req.body);
    res.status(200).send({ detail: expenseStatus });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Get all expense status.
 */
router.get(`${URL}/all`, auth, async (req, res) => {
  try {
    const expenseStatus = await ExpenseStatus.find();
    res.status(200).send({ detail: expenseStatus });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Delete an expense status
 */
router.delete(`${URL}/:id`, auth, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  try {
    const obj = await ExpenseStatus.findOneAndDelete({
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
 * Get Pageable of Expense Status.
 * @param `page`, `size` request parameters.
 */
router.get(`${URL}/list`, auth, async (req, res) => {
  const page = req.query.page;
  const size = req.query.size;
  const skips = size * (page - 1);
  try {
    const expenseStatus = await ExpenseStatus.find()
      .skip(skips)
      .limit(Number(size));
    const totalElementsCount = await ExpenseStatus.countDocuments();
    res.status(200).send({
      detail: {
        content: expenseStatus,
        totalElements: totalElementsCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Get status count of expense status.
 */
router.get(`${URL}/status-count`, auth, async (req, res) => {
  try {
    const totalCount = await ExpenseStatus.countDocuments();
    res.status(200).send({
      detail: { totalCount: totalCount }
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

module.exports = router;
