const express = require("express")
const router = express.Router()
var fs = require("fs")
var vfMail = ""
fs.readFile("./files/verification-mail.html", function (err, file) {
  vfMail = file.toString()
})
const verifiedUser = require("../models/verified-user")
const config = require("../config")
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")

router.use(
  bodyParser.urlencoded({
    extended: true
  })
)
router.use(bodyParser.json())

module.exports = router
