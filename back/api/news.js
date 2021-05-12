const router = require("express").Router()
const news = require("../models/News")
const formalEntity = require("../models/FormalEntity")
const config = require("../config")
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")

router.use(
  bodyParser.urlencoded({
    extended: true
  })
)
router.use(bodyParser.json())

router.put("/create-news", (rqst, rspns, next) => {
  var rspnsBdy = {data:{},description:{}}
  var {body} = rqst
  var responseStatus = 400
  var { owner_id, owner_name, title, description } = body;
  if(!owner_id || !owner_name || !title || !description) {
    rspnsBdy.description = config.required_check;
    rspns.status(responseStatus).json(rspnsBdy)
  }
  else {
    new news(body).save((ahOh, ntt) => {
        if(ahOh) config.handleError(ahOh, rqst, rspns)
        else if(ntt) {
            formalEntity.findByIdAndUpdate(
                owner_id,
                {
                    $push: {
                        news: {
                            news_id: ntt._id,
                            news_title: ntt.title
                        }
                    }
                },
                (ahOh) => {
                    if(ahOh) config.handleError(ahOh, rqst, rspns)
                }
            )
            responseStatus = 200
            rspnsBdy.message = {
                message: "news added"
            }
            rspns.status(responseStatus).json(rspnsBdy)
        }
    })
  }
})

router.put("/edit-news", (rqst, rspns, next) => {
    var rspnsBdy = {data:{},description:{}}
    var {body, query} = rqst
    var responseStatus = 400
    var { news_id } = query;
    var { owner_id, owner_name, title, description } = body;
    if(!news_id || !owner_id || !owner_name || !title || !description) {
      rspnsBdy.description = config.required_check;
      rspns.status(responseStatus).json(rspnsBdy)
    }
    else {
        news.findByIdAndUpdate(
          news_id,
          body,
          (ahOh) => {
          if(ahOh) config.handleError(ahOh, rqst, rspns)
          else {
            responseStatus = 200
            rspnsBdy.message = {
              message: "news edited"
            }
            rspns.status(responseStatus).json(rspnsBdy)
          }
      })
    }
})

router.delete("/delete-news", (rqst, rspns, next) => {
    var rspnsBdy = {data:{},description:{}}
    var {body} = rqst
    var responseStatus = 400
    var { owner_id, title, description } = body;
    if(!owner_id || !title || !description) {
      rspnsBdy.description = config.required_check;
      rspns.status(responseStatus).json(rspnsBdy)
    }
    else {
      new news(body).save((ahOh, ntt) => {
          if(ahOh) config.handleError(ahOh, rqst, rspns)
          else if(ntt) {
              formalEntity.findByIdAndUpdate(
                  owner_id,
                  {
                      $push: {
                          news: {
                              news_id: ntt._id,
                              news_title: ntt.title
                          }
                      }
                  },
                  (ahOh) => {
                      if(ahOh) config.handleError(ahOh, rqst, rspns)
                  }
              )
              responseStatus = 200
              rspnsBdy.message = {
                  message: "news added"
              }
              rspns.status(responseStatus).json(rspnsBdy)
          }
      })
    }
})

module.exports = router
