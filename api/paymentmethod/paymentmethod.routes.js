const express = require("express");
const PaymentMethod = require("./paymentmethod.model");
const auth = require("../../config/auth/jwt.auth");
const { ObjectID } = require("mongodb");

const router = express.Router();

const URL = "/v1/payment-method";

/**
 * Save new payment method.
 */
router.post(`${URL}`, auth, async (req, res) => {
  try {
    const paymentMethod = new PaymentMethod(req.body);
    await paymentMethod.save();
    res.status(201).send({ paymentMethod: paymentMethod });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

/**
 * Update a payment method.
 */
router.patch(`${URL}`, auth, async (req, res) => {
  try {
    const id = req.body._id;
    const paymentMethod = await PaymentMethod.findOneAndUpdate(id, req.body);
    res.status(200).send({ paymentMethod: paymentMethod });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

/**
 * Get all payment methods.
 */
router.get(`${URL}/all`, auth, async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({});
    res.status(200).send({ paymentMethods: paymentMethods });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
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
    res.status(200).send(obj);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

module.exports = router;
