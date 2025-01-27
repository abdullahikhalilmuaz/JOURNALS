const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    unique: true,
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Static sign-up method
userSchema.statics.signup = async function (
  firstname,
  lastname,
  username,
  email,
  password
) {
  // Validation
  if (!firstname || !lastname || !username || !email || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  // Check if user already exists
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);

  // Create user with all fields
  const user = await this.create({
    firstname,
    lastname,
    username,
    email,
    password: hash,
  });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  //check users existance
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcryptjs.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
