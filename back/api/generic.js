const express = require("express")
const router = express.Router()
const casualEntity = require("../models/CasualEntity")
const formalEntity = require("../models/FormalEntity")
const loggedError = require("../models/LoggedError")

const bodyParser = require("body-parser")
router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

router.get("/unverified-users", (req, res, next) => {
  casualEntity.find(function (err, users) {
    res.status(200).json(users)
  })
})
router.get("/verified-users", (req, res, next) => {
  formalEntity.find(function (err, users) {
    res.status(200).json(users)
  })
})
router.get("/delete-all-unverified-users", (req, res, next) => {
  casualEntity.remove({}, () => {
    casualEntity.find(function (err, users) {
      res.status(200).json(users)
    })
  })
})
router.get("/delete-all-verified-users", (req, res, next) => {
  formalEntity.remove({}, () => {
    formalEntity.find(function (err, users) {
      res.status(200).json(users)
    })
  })
})
router.get("/logged-errors", (req, res, next) => {
  loggedError.find(function (err, errors) {
    res.status(200).json(errors)
  })
})
router.get("/delete-all-logged-errors", (req, res, next) => {
  loggedError.remove({}, () => {
    formalEntity.find(function (err, errors) {
      res.status(200).json(errors)
    })
  })
})

router.get("/request-data", (req, res, next) => {
  res.status(200).json({
    req_app: req.app,
    req_baseUrl: req.baseUrl,
    req_body: req.body,
    req_cookies: req.cookies,
    req_fresh: req.fresh,
    req_hostname: req.hostname,
    req_ip: req.ip,
    req_ips: req.ips,
    req_method: req.method,
    req_originalUrl: req.originalUrl,
    req_params: req.params,
    req_path: req.path,
    req_protocol: req.protocol,
    req_query: req.query,
    req_route: req.route,
    req_secure: req.secure,
    req_signedCookies: req.signedCookies,
    req_stale: req.stale,
    req_subdomains: req.subdomains,
    req_xhr: req.xhr,
  })
})

module.exports = router
