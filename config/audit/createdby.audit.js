const audit = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error();
    }
    req.body.createdBy = req.user._id;
    next();
  } catch (error) {
    res.status(500).send({ error: "Failed to add created by" });
  }
};

module.exports = audit;
