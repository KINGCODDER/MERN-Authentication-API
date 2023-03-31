const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  message: {
    type: String,
    require: [true, "Message cannot be blank"],
  },
  comments: [
    {
      sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      sentAt: {
        type: Date,
        default: Date.now(),
      },
      liked: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    },
  ],
});

const post = mongoose.model("post", postSchema);
module.exports = post;
