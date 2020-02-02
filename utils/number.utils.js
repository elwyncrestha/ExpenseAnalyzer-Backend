module.exports = {
  /**
   * Generates random integer between two numbers low (inclusive) and high (inclusive).
   */
  generateRandom: (low, high) => {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }
};
