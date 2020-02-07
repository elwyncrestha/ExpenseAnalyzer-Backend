const express = require("express");
const PaymentMethod = require("./paymentmethod.model");
const auth = require("../../config/auth/jwt.auth");
const { ObjectID } = require("mongodb");
const audit = require("../../config/audit/createdby.audit");

const router = express.Router();

const URL = "/v1/payment-method";

/**
 * Save new payment method.
 */
router.post(`${URL}`, auth, audit, async (req, res) => {
  try {
    const paymentMethod = new PaymentMethod(req.body);
    const saved = await paymentMethod.save();
    res.status(201).send({ detail: saved });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Update a payment method.
 */
router.patch(`${URL}`, auth, async (req, res) => {
  try {
    const id = req.body.id ? req.body.id : req.body._id;
    const paymentMethod = await PaymentMethod.findByIdAndUpdate(id, req.body);
    res.status(200).send({ detail: paymentMethod });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Get all payment methods.
 */
router.get(`${URL}/all`, auth, async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({
      createdBy: req.user._id
    });
    res.status(200).send({ detail: paymentMethods });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Delete a payment method
 */
router.delete(`${URL}/:id`, auth, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  try {
    const obj = await PaymentMethod.findOneAndDelete({
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
 * Get Pageable of Payment Methods.
 * @param `page`, `size` request parameters.
 */
router.get(`${URL}/list`, auth, async (req, res) => {
  const page = req.query.page;
  const size = req.query.size;
  const skips = size * (page - 1);
  try {
    const paymentMethods = await PaymentMethod.find({ createdBy: req.user._id })
      .skip(skips)
      .limit(Number(size));
    const totalElementsCount = await PaymentMethod.countDocuments({
      createdBy: req.user._id
    });
    res.status(200).send({
      detail: {
        content: paymentMethods,
        totalElements: totalElementsCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Get status count of payment methods.
 */
router.get(`${URL}/status-count`, auth, async (req, res) => {
  try {
    const totalCount = await PaymentMethod.countDocuments({
      createdBy: req.user._id
    });
    res.status(200).send({
      detail: { totalCount: totalCount }
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

module.exports = router;
