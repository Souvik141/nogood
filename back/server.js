const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const config = require("./config")
const app = express()

app.use(cors())
//connect to mongodb
mongoose.connect(
  "mongodb://localhost:27017/mern-fsd-pj-zoziozoq-back-end-api",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
)

// on connection
mongoose.connection.on("connected", () => {
  console.log("Connectd to database mongodb @ 27017")
})

mongoose.connection.on("error", (err) => {
  if (err) {
    console.log("Error in Database connection: " + err)
  }
})

app.use("/api/auth", require("./api/auth.js"))
app.use("/api/profile", require("./api/profile.js"))
app.use("/api/news", require("./api/news.js"))
app.use("/api/generic", require("./api/generic.js"))

app.listen(config.port, () => {
  console.log("Server strted at port:" + config.port)
})

// const convoSection = require("./models/ConvoSection")
// const convoContribution = require("./models/ConvoContribution")
// var newConvoContrib = new convoContribution({
//   contributor: 'Sav',
//   contributor_unique: 'sav',
//   contributor_contribution: '...\nHave totally no idea :|'
// });
// new convoSection({
//   creator: 'Some One',
//   creator_unique: 'chuku_baka',
//   to: 'all',
//   to_unique: 'all',
//   conversation_subject: 'What the heck Government is there for?',
//   contributions: [newConvoContrib]
// }).save();