const mongoose = require("mongoose")
module.exports = mongoose.model(
  "News",
  mongoose.Schema({
    owner_id: {
      type: String,
      required: true,
    },
    owner_name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [
      {
        review_description: {
          type: String,
          required: true,
        },
        review_owner_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        review_owner_name: {
          type: String,
          required: true,
        },
      },
    ],
  })
)
