const router = require("express").Router()
var vfMail = '';
require('fs').readFile('./files/vrfcsn_mail.html', function (ahOh, file) {
 vfMail = file.toString();
});
const casualEntity = require("../models/CasualEntity")
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

/* Request Registration */
router.post("/request-registration", (rqst, rspns, next) => {
  var rspnsBdy = {data:{},description:{}}
  casualEntity
  .findOne()
  .where({
    email: rqst.body.email
  })
  .exec((ahOh, ntt) => {
    if (ahOh) config.handleError(ahOh, rqst, rspns) /* error scenario */
    else if (ntt) {
      if (!ntt.formalized) {
        /* scenario 1: already requested registration */
        rspnsBdy.description = config.RGRSTD001
        rspns.status(config.RGRSTD001_STCD).json(rspnsBdy)
      } else {
        /* scenario 2: already registered */
        rspnsBdy.description = config.RGRSTD002
        rspns.status(config.RGRSTD002_STCD).json(rspnsBdy)
      }
    } else {
      new casualEntity({
        email: rqst.body.email,
        password: rqst.body.password
      }).save((ahOh) => {
        if (ahOh) config.handleError(ahOh, rqst, rspns)
        else {
          /* scenario 3: everything went flawlessly?? */
          rspnsBdy.description = config.RGRSTD003
          rspns.status(config.RGRSTD003_STCD).json(rspnsBdy)
        }
      })
    }
  })
})

//Generate Verification Code
router.get("/generate-verification-code/:email", (rqst, rspns, next) => {
  var rspnsBdy = {data:{},description:{}}
  const DATE_NOW = Date.now()
  const vercode = (DATE_NOW % config.ENCODE_MOD) + config.ENCODE_OFFSET
  casualEntity
    .findOne()
    .where({
      email: decodeURI(rqst.params.email),
      formalized: false
    })
    .exec((ahOh, ntt) => {
      if (ahOh) config.handleError(ahOh, rqst, rspns)
      else if (ntt) {
        casualEntity.findByIdAndUpdate(
          ntt.id,
          {
            verificationCode: vercode,
            verificationCodeTimestamp: DATE_NOW
          },
          (ahOh, ntt) => {
            if (ahOh) config.handleError(ahOh, rqst, rspns)
            else if (!ntt) {
              rspnsBdy.message = config.usr_dsnt_xst
              rspns.status(config.usr_dsnt_xst_stcd).json(rspnsBdy)
            } else {
              vfMail = vfMail.toString().replace("{{$domain}}", config.server_domain);
              vfMail = vfMail.toString().replace("{{$vercode}}", vercode);
              vfMail = vfMail.toString().replace("{{$email}}", ntt.email);
              var mailOptions = {
                from: config.server_email,
                to: ntt.email,
                subject: 'Email to verify your registration',
                html: vfMail
              };
              config.transporter.sendMail(mailOptions, function(ahOh){
                if (ahOh) config.handleError(ahOh, rqst, rspns)
              });
              rspnsBdy.description = config.vfcode_gen
              rspns.status(config.vfcode_gen_stcd).json(rspnsBdy)
            }
          }
        )
      } else {
        rspnsBdy.description = config.usr_dsnt_xst
        rspns.status(config.usr_dsnt_xst_stcd).json(rspnsBdy)
      }
    })
})

router.get("/verify-registration", (rqst, rspns, next) => {
  var rspnsBdy = {data:{},description:{}}
  const DATE_NOW = Date.now()
  let responseStatus = 400
  casualEntity
    .findOne()
    .where({
      email: decodeURI(rqst.query.email),
      formalized: false
    })
    .exec((ahOh, ntt)=>{
      if(ahOh) config.handleError(ahOh, rqst, rspns)
      else if (ntt) {
        responseStatus = 200
        if (
          rqst.query.vercode === ntt.verificationCode &&
          ntt.verificationCodeTimestamp + config.TIMESTAMP_OFFSET >=
            DATE_NOW
        ) {
          formalEntity
            .findOne()
            .where({
              email: ntt.email
            })
            .exec((ahOh, fntt) => {
              if(ahOh) config.handleError(ahOh, rqst, rspns)
              else if (fntt) {
                rspnsBdy.description = "Entity already formalized, how the F it happend?"
                rspns.status(400).json(rspnsBdy)
              } else {
                new formalEntity({
                  email: ntt.email,
                  password: ntt.password,
                  isLoggedIn: false,
                  unverifiedUserId: ntt._id
                }).save((ahOh, ntt) => {
                  if(ahOh) config.handleError(ahOh, rqst, rspns)
                  else {
                    casualEntity.findByIdAndUpdate(
                      ntt._id,
                      {
                        formalized: true,
                        verifiedUserId: ntt.id
                      },
                      (ahOh) => {
                        if(ahOh) config.handleError(ahOh, rqst, rspns)
                      }
                    )
                    responseStatus = 200
                    rspnsBdy.message = config.USER_ADDED
                    rspns.status(responseStatus).redirect(config.client_domain)
                  }
                })
              }
            })
        } else {
          responseStatus = 200
          rspnsBdy.message = config.VERIFICATION_CODE_WRNG_O_EXP
          rspns.status(responseStatus).json(rspnsBdy)
        }
      } else {
        responseStatus = 200
        rspnsBdy.message = config.usr_dsnt_xst
        rspns.status(responseStatus).json(rspnsBdy)
      }
    })
})

//Request login (used JWT)
router.post("/request-login", (rqst, rspns, next) => {
  var rspnsBdy = {data:{},description:{}}
  formalEntity
    .findOne()
    .where({
      email: rqst.body.email,
      password: rqst.body.password
    })
    .exec((ahOh, ntt) => {
      if (ahOh) config.handleError(ahOh, rqst, rspns)
      else if (ntt !== null) {
        formalEntity.findByIdAndUpdate(
          ntt._id,
          {
            isLoggedIn: true
          },
          (ahOh, fntt) => {
            if (ahOh) config.handleError(ahOh, rqst, rspns)
            else {
              responseStatus = 200
              rspnsBdy.data.auth = true
              rspnsBdy.data.token = jwt.sign(
                {
                  id: fntt._id
                },
                config.secret,
                {
                  expiresIn: 86400
                }
              )
              rspnsBdy.description = config.lgn_scs
              rspns
                .set("Content-Type", "application/json")
                .status(config.lgn_scs_stcd)
                .send(JSON.stringify(rspnsBdy))
            }
          }
        )
      } else {
        rspnsBdy.data = {}
        rspnsBdy.description = config.rng_crds
        rspns
          .set("Content-Type", "application/json")
          .status(config.rng_crds_stcd)
          .send(JSON.stringify(rspnsBdy))
      }
    })
})

router.get("/request-logout/:email", (rqst, rspns, next) => {
  var rspnsBdy = {data:{},description:{}}
  let responseStatus = 400
  formalEntity
    .findOne()
    .where({
      email: rqst.params.email
    })
    .exec((ahOh, ntt) => {
      if(ahOh) config.handleError(ahOh, rqst, rspns)
      else if(ntt) {responseStatus = 200
        rspnsBdy.data.auth = true
        rspnsBdy.data.token = jwt.sign(
          {
            id: ntt._id
          },
          config.secret,
          {
            expiresIn: 86400
          }
        )
        formalEntity.findByIdAndUpdate(
          ntt._id,
          {
            isLoggedIn: false,
            lastActiveFrom: ""
          },
          (ahOh) => {
            if(ahOh) config.handleError(ahOh, rqst, rspns)
            else {
              responseStatus = 200
              rspnsBdy.message = config.USER_LOGGED_OUT_SUCCESSFULLY
              rspns.status(responseStatus).json(rspnsBdy)
            }
          }
        )
      }
    })
})

router.post("/request-password-change", (rqst, rspns, next) => {
  var rspnsBdy = {data:{},description:{}}
  formalEntity
    .findOne()
    .where({
      email: rqst.body.email
    })
    .exec((ahOh, ntt)=>{
      if(ahOh) config.handleError(ahOh, rqst, rspns)
      else if (ntt) {
        rspnsBdy.data.token = jwt.sign(
          {
            id: ntt._id
          },
          config.secret,
          {
            expiresIn: 300
          }
        )
        rspnsBdy.description = config.pwd_chng_rqst_aknowldgd
        rspns.status(config.pwd_chng_rqst_aknowldgd_stcd).json(rspnsBdy)
      } else {
        rspnsBdy.description = config.usr_dsnt_xst
        rspns.status(config.usr_dsnt_xst_stcd).json(rspnsBdy)
      }
    })
})

router.post("/change-password", (rqst, rspns, next) => {
  var rspnsBdy = {data:{},description:{}}
  var token = rqst.headers["x-access-token"]
  var nwPwd = rqst.body.password;
  if (!token) {
    rspnsBdy.description = config.bad_rqst
    return rspns.status(config.bad_rqst_stcd).send(rspnsBdy)
  }
  jwt.verify(token, config.secret, function (ahOh, decoded) {
    if (ahOh) config.handleError(ahOh, rqst, rspns)
    formalEntity.findByIdAndUpdate(
      decoded.id,
      {
        password: nwPwd
      },
      (ahOh, ntt)=>{
        if (ahOh) config.handleError(ahOh, rqst, rspns)
        if (!ntt) {
          rspnsBdy.description = config.usr_dsnt_xst
          return rspns.status(config.usr_dsnt_xst_stcd).send(rspnsBdy)
        }
        rspnsBdy.description = config.pwd_chngd_sccs
        rspns.status(config.pwd_chngd_sccs_stcd).send(rspnsBdy)
      }
    )
  })
})

router.get("/validate", (rqst, rspns, next) => {
  var rspnsBdy = {data:{},description:{}}
  var token = rqst.headers["x-access-token"]

  if (!token) {
    rspnsBdy.description.auth = false
    rspnsBdy.description = config.n_auth_tk
    return rspns.status(config.n_auth_tk_stcd).send(rspnsBdy)
  }
  jwt.verify(token, config.secret, function (ahOh, decoded) {
    if (ahOh) {
      config.handleError(ahOh, rqst, rspns)
    }
    else
      formalEntity.findById(
        decoded.id,
        {
          _id: 0,
          password: 0,
          __v: 0,
        },
        function (ahOh, ntt) {
          if (ahOh) config.handleError(ahOh, rqst, rspns)
          if (!ntt) {
            rspnsBdy.description.auth = false
            rspnsBdy.description = config.usr_dsnt_xst
            return rspns.status(config.usr_dsnt_xst_stcd).send(rspnsBdy)
          }
          rspnsBdy.data = ntt
          rspns.status(200).send(rspnsBdy)
        }
      )
  })
})

module.exports = router
