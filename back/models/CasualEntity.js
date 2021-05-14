const mongoose = require("mongoose")
module.exports = mongoose.model(
  "CasualEntity",
  mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationCode: String,
    verificationCodeTimestamp: Number,
    formalized: {
      type: Boolean,
      default: false,
      required: true,
    },
    FormalEntity_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormalEntity",
    },
  })
)
