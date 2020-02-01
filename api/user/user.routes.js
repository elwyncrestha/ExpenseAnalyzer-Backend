const express = require("express");
const User = require("./user.model");
const auth = require("../../config/auth/jwt.auth");

const router = express.Router();

const URL = "/v1/users";

/**
 * Save new user.
 */
router.post(`${URL}`, async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

/**
 * Login registered user.
 */
router.post(`${URL}/login`, async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByCredentials(username, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

/**
 * Get logged-in user profile.
 */
router.get(`${URL}/authenticated`, auth, async (req, res) => {
  res.send(req.user);
});

/**
 * Logout user from current device.
 */
router.get(`${URL}/logout`, auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Logout user from all authenticated devices.
 */
router.get(`${URL}/logout/all`, auth, async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
