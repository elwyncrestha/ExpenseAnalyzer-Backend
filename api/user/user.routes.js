const express = require("express");
const User = require("./user.model");
const auth = require("../../config/auth/jwt.auth");
const mailer = require("../../config/mail/nodemailer");
const NumberUtils = require("../../utils/number.utils");

const router = express.Router();

const URL = "/v1/users";

/**
 * Save new user.
 */
router.post(`${URL}`, async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ detail: { user, token } });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
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
    res.send({ detail: token });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Get logged-in user profile.
 */
router.get(`${URL}/authenticated`, auth, async (req, res) => {
  res.send({ detail: req.user });
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
    console.error(error);
    res.status(500).send({ error: error });
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
    console.error(error);
    res.status(500).send({ error: error });
  }
});

/**
 * Initiate user password reset by an email address.
 */
router.get(`${URL}/reset-password/email/:value`, async (req, res) => {
  try {
    const email = req.params.value;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    const token = NumberUtils.generateRandom(1000, 9999);
    user.resetToken = token;
    await user.save();
    // send mail with reset token.
    mailer.sendMail(
      email,
      "Reset Password",
      `Use this token: ${token} to reset your password`
    );
    res.send({ detail: user });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

/**
 * Reset user password.
 * @param `email`, `token`, `password`
 */
router.post(`${URL}/reset-password`, async (req, res) => {
  try {
    const email = req.body.email;
    const token = req.body.token;
    const password = req.body.password;

    const user = await User.findByEmail(email);
    if (user.resetToken !== token) {
      return res.status(401).send({ error: "Token did not match" });
    }

    user.resetToken = null;
    user.password = password;
    await user.save();
    res.send();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error });
  }
});

/**
 * Update an user.
 */
router.patch(`${URL}`, async (req, res) => {
  try {
    const id = req.body._id;
    const user = await User.findOneAndUpdate({ _id: id }, req.body);
    res.status(200).send({ detail: user });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error });
  }
});

module.exports = router;
