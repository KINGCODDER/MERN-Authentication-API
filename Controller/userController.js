const User = require("../Schema/userSchema");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry a user with this email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
      mobile: req.body.mobile,
    });

    const data = {
      user: {
        id: user.id,
      },
    };

    const token = user.generateAuthToken();

    res.status(200).json({
      status: "success",
      token: token,
      data: {
        user: user,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const user = await User.find({});

    res.status(200).json({
      status: "success",
      results: user.length,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      req.body.password = secPass;
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    res.status(203).json({
      status: "success",
      token: token,
      refreshToken: refreshToken,
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "User Not found",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      throw new Error();
    }

    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "User Not found",
    });
  }
};
