const express = require("express");
const cors = require("cors");
const userRouter = require("./api/user/user.routes");
const categoryRouter = require("./api/category/category.routes");
const paymentMethodRouter = require("./api/paymentmethod/paymentmethod.routes");
const expenseStatusRouter = require("./api/expensestatus/expensestatus.routes");
const expenseRouter = require("./api/expense/expense.routes");
require("dotenv/config");
require("./config/db/mongo");

const port = process.env.SERVER_PORT;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(userRouter);
app.use(categoryRouter);
app.use(paymentMethodRouter);
app.use(expenseStatusRouter);
app.use(expenseRouter);

// Server
app.listen(port, () => {
  console.log(`Express Analyzer server running on port ${port}`);
});
