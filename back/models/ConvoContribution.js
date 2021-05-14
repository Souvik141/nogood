const mongoose = require("mongoose")
module.exports = mongoose.model(
  "ConvoContribution",
  mongoose.Schema({
    contributor: {
      type: String,
      required: true,
    },
    contributor_unique: {
      type: String,
      required: true,
    },
    contributor_contribution: {
      type: String,
      required: true,
    },
  })
)
