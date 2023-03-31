const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "A user must have a name"],
  },
  email: {
    type: String,
    require: [true, "A user must have an email"],
    unique: [true, "A user with this email exists"],
  },
  mobile: {
    type: Number,
    require: [true, "A user must have a contact detail"],
  },
  password: {
    type: String,
    require: [true, "A user must have a password"],
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );
  return token;
};

const user = mongoose.model("user", userSchema);
module.exports = user;
