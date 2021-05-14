const express = require("express")
const router = express.Router()
const product = require("../models/product")
const loggedError = require("../models/logged-error")

const bodyParser = require("body-parser")
router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

//response structure
let response = {data: {}, description: {}, error: {}}

//Request Registration
const PRDCT_REGISTERED = {message_code: "001", message: "Product registered"}

router.post("/register-product", (req, res, next) => {
  new product({
    email: req.body.email,
    password: req.body.password,
  }).save((error, user) => {
    if (error) {
      new loggedError({
        request_body: JSON.stringify(req.body),
        error_description: JSON.stringify(
          error,
          Object.getOwnPropertyNames(error)
        ),
      }).save()
      response.description = GENERIC_ERROR
      res.status(400).json(response)
    } else {
      response.data.id = user.id
      response.description = PRDCT_REGISTERED
      res.status(200).json(response)
    }
  })
})

module.exports = router
