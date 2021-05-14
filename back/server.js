const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const morgan = require("morgan")
const app = express()
require("dotenv").config()

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(express.json())
//connect to mongodb
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

// on connection
mongoose.connection.on("connected", () => {
  console.log(`Connectd to database mongodb @ ${process.env.MONGO_URI}`)
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

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} environment on port ${process.env.SERVER_PORT}`
  )
})
