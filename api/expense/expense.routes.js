const express = require("express");
const Expense = require("./expense.model");
const auth = require("../../config/auth/jwt.auth");
const { ObjectID } = require("mongodb");
const audit = require("../../config/audit/createdby.audit");

const router = express.Router();

const URL = "/v1/expense";

/**
 * Save new expense.
 */
router.post(`${URL}`, auth, audit, async (req, res) => {
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
    const id = req.body.id ? req.body.id : req.body._id;
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
    const expenses = await Expense.find({ createdBy: req.user._id })
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
    const expenses = await Expense.find({ createdBy: req.user._id })
      .skip(skips)
      .limit(Number(size))
      .populate("category")
      .populate("paymentMethod")
      .populate("status");
    const totalElementsCount = await Expense.countDocuments({
      createdBy: req.user._id
    });
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

/**
 * Get status count of expenses.
 */
router.get(`${URL}/status-count`, auth, async (req, res) => {
  try {
    const incomeTransactions = await Expense.countDocuments({
      createdBy: req.user._id,
      type: 1
    });
    const expenseTransactions = await Expense.countDocuments({
      createdBy: req.user._id,
      type: 0
    });
    res.status(200).send({
      detail: {
        incomeCount: incomeTransactions,
        expenseCount: expenseTransactions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Get data for transaction duration charts.
 */
router.get(`${URL}/chart/transaction-duration`, auth, async (req, res) => {
  try {
    const expense = {
      today: {
        income: null,
        expense: null
      },
      thisWeek: {
        income: null,
        expense: null
      },
      thisMonth: {
        income: null,
        expense: null
      },
      thisYear: {
        income: null,
        expense: null
      }
    };
    const expenseFilter = {
      createdBy: req.user._id,
      type: 0
    };
    const incomeFilter = {
      createdBy: req.user._id,
      type: 1
    };
    const current = new Date();

    // Today
    expense.today.income = await Expense.find({
      ...incomeFilter,
      date: {
        $eq: new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate()
        ).toISOString()
      }
    });
    expense.today.expense = await Expense.find({
      ...expenseFilter,
      date: {
        $eq: new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate()
        ).toISOString()
      }
    });

    // This week
    expense.thisWeek.expense = await Expense.find({
      ...expenseFilter,
      date: {
        $gt: new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate() - 7
        ).toISOString(),
        $lte: new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate()
        ).toISOString()
      }
    });
    expense.thisWeek.income = await Expense.find({
      ...incomeFilter,
      date: {
        $gt: new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate() - 7
        ).toISOString(),
        $lte: new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate()
        ).toISOString()
      }
    });

    // This month
    expense.thisMonth.expense = await Expense.find({
      ...expenseFilter,
      date: {
        $gt: new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          current.getDate()
        ).toISOString(),
        $lte: new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate()
        ).toISOString()
      }
    });
    expense.thisMonth.income = await Expense.find({
      ...incomeFilter,
      date: {
        $gt: new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          current.getDate()
        ).toISOString(),
        $lte: new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate()
        ).toISOString()
      }
    });

    // This year
    expense.thisYear.expense = await Expense.find({
      ...expenseFilter,
      date: {
        $gt: new Date(
          current.getFullYear() - 1,
          current.getMonth(),
          current.getDate()
        ).toISOString(),
        $lte: new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate()
        ).toISOString()
      }
    });
    expense.thisYear.income = await Expense.find({
      ...incomeFilter,
      date: {
        $gt: new Date(
          current.getFullYear() - 1,
          current.getMonth(),
          current.getDate()
        ).toISOString(),
        $lte: new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate()
        ).toISOString()
      }
    });
    res.send({ detail: expense });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error });
  }
});

/**
 * Get by id.
 */
router.get(`${URL}/:id`, auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("category")
      .populate("paymentMethod")
      .populate("status");
    res.status(200).send({ detail: expense });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

module.exports = router;
