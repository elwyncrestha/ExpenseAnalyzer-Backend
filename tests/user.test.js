require("dotenv/config");
const mongoose = require("mongoose");
const User = require("../api/user/user.model");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => await mongoose.connection.close());

describe("Testing: User Schema", () => {
  // 1
  it("Test: Add User", () => {
    const user = {
      firstName: "Elvin",
      middleName: null,
      lastName: "Shrestha",
      email: "elwyncrestha@gmail.com",
      username: "elwyncrestha",
      password: "12345678"
    };

    return User.create(user).then(response =>
      expect(response.username).toEqual("elwyncrestha")
    );
  });

  // 2
  it("Test: Count All Users", async () => {
    const count = await User.countDocuments();

    expect(count).toEqual(1);
  });

  // 3
  it("Test: Get User", async () => {
    const user = await User.findOne({ username: "elwyncrestha" });

    expect(user.email).toBe("elwyncrestha@gmail.com");
  });

  // 4
  it("Test: Update User", async () => {
    const find = await User.findOne({ username: "elwyncrestha" });
    find.email = "elwyncrestha@hotmail.com";

    await User.update(find);

    const updated = await User.findOne({ username: "elwyncrestha" });

    expect(updated.email).toEqual("elwyncrestha@hotmail.com");
  });

  // 5
  it("Test: Delete User", async () => {
    const status = await User.deleteOne({ username: "elwyncrestha" });

    expect(status.deletedCount).toEqual(1);
  });
});
