const mongoose = require("mongoose")
const ConvoContribution = require("./ConvoContribution")
module.exports = mongoose.model("ConvoSection", mongoose.Schema({
  creator: {
    type: String,
    required: true
  },
  creator_unique: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  to_unique: {
    type: String,
    required: true
  },
  conversation_subject: {
    type: String,
    required: true
  },
  conversation_description: String,
  contributions: [{
    type: ConvoContribution.schema,
    default: () => ({})
  }]
}))