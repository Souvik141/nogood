const mongoose = require("mongoose")
module.exports = mongoose.model("FormalEntity", mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isLoggedIn: Boolean,
  lastActiveFrom: String,
  CasualEntity_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CasualEntity"
  },
  Image_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image"
  },
  firstName: String,
  middleName: String,
  lastName: String,
  dateOfBirth: String,
  news: [{
    news_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    news_title: {
      type: String,
      required: true
    }
  }]
}))
