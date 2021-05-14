const mongoose = require("mongoose")
module.exports = mongoose.model(
  "LoggedError",
  mongoose.Schema({
    request_path: String,
    request_method: String,
    request_params: String,
    request_query: String,
    request_body: String,
    error_description: {
      type: String,
      required: true,
    },
    gmt_timestamp: {
      type: Date,
      required: true,
      default: Date(),
    },
  })
)
