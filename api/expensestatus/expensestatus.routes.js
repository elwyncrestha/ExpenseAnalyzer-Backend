const express = require("express");
const ExpenseStatus = require("./expensestatus.model");
const auth = require("../../config/auth/jwt.auth");

const router = express.Router();

const URL = "/v1/expense-status";

/**
 * Save new expense status.
 */
router.post(`${URL}`, auth, async (req, res) => {
  try {
    const expenseStatus = new ExpenseStatus(req.body);
    await expenseStatus.save();
    res.status(201).send({ expenseStatus: expenseStatus });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

/**
 * Update an expense status.
 */
router.patch(`${URL}`, auth, async (req, res) => {
  try {
    const id = req.body._id;
    const expenseStatus = await ExpenseStatus.findOneAndUpdate(id, req.body);
    res.status(200).send({ expenseStatus: expenseStatus });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

/**
 * Get all expense status.
 */
router.get(`${URL}/all`, auth, async (req, res) => {
  try {
    const expenseStatus = await ExpenseStatus.find({});
    res.status(200).send({ expenseStatus: expenseStatus });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

module.exports = router;
