const nodemailer = require("nodemailer")
const loggedError = require("./models/LoggedError")
const __logError = (ahOh, rqst) => {
  try {
    new loggedError({
      request_path: rqst.originalUrl,
      request_method: rqst.method,
      request_params: JSON.stringify(rqst.params),
      request_query: JSON.stringify(rqst.query),
      request_body: JSON.stringify(rqst.body),
      error_description: JSON.stringify(ahOh, Object.getOwnPropertyNames(ahOh)),
    }).save()
    return true
  } catch (ahOh) {
    return false
  }
}

module.exports = {
  required_check: {
    message_code: "INV",
    message: "mandatory data missing",
  },
  generic_error_stcd: 500,
  generic_error: {
    message_code: "000",
    message: "Something went wrong, please contact your System Administrator",
  },
  VERIFICATION_CODE_WRNG_O_EXP: "Verification code is wrong or expired",
  USR_ALRDY_XSTS: "User already exists",
  USER_ADDED: "User added successfully",
  USER_LOGGED_OUT_SUCCESSFULLY: "User is successfully logged out",
  ENCODE_MOD: 5478,
  ENCODE_OFFSET: 3411,
  TIMESTAMP_OFFSET: 300000,

  RGRSTD001_STCD: 400,
  RGRSTD001: {
    message_code: "001",
    message: "Already registration requested, verify your registration",
  },
  RGRSTD002_STCD: 401,
  RGRSTD002: {
    message_code: "002",
    message: "Email already registered, try logging in",
  },
  RGRSTD003_STCD: 200,
  RGRSTD003: {
    message_code: "003",
    message:
      "Registration requested, generate verification code and verify your registration",
  },
  usr_dsnt_xst_stcd: 400,
  usr_dsnt_xst: {
    message_code: "004",
    message: "User doesn't exist",
  },
  vfcode_gen_stcd: 200,
  vfcode_gen: {
    message_code: "005",
    message: "Verification code generated",
  },
  usr_lrdy_vrfied_stcd: 400,
  usr_lrdy_vrfied: {
    message_code: "006",
    message: "User is already verified, try logging in",
  },
  pwd_chng_rqst_aknowldgd_stcd: 200,
  pwd_chng_rqst_aknowldgd: {
    message_code: "007",
    message:
      "Password change request acknowledged, check your email for further instruction",
  },
  bad_rqst_stcd: 500,
  bad_rqst: {
    message_code: "008",
    message: "Bad request",
  },
  pwd_chngd_sccs_stcd: 500,
  pwd_chngd_sccs: {
    message_code: "009",
    message: "Password changed successfully",
  },
  lgn_scs_stcd: 200,
  lgn_scs: {
    message_code: "021",
    message: "You are successfully logged in",
  },
  rng_crds_stcd: 401,
  rng_crds: {
    message_code: "022",
    message: "Credentials are wrong or User doesn't exist",
  },
  n_auth_tk_stcd: 401,
  n_auth_tk: {
    message_code: "023",
    message: "No token provided",
  },
  response_structure: {
    data: {},
    description: {},
    ahOh: {},
  },
  handleError: (ahOh, rqst, rspns) => {
    var response = {data: {}, description: {}, ahOh: {}}
    response.description = {
      message_code: "000",
      message: "Something went wrong, please contact your System Administrator",
    }
    response.ahOh = JSON.stringify(ahOh, Object.getOwnPropertyNames(ahOh))
    response.errorLogged = __logError(ahOh, rqst)
    rspns
      .set("Content-Type", "application/json")
      .status(500)
      .send(JSON.stringify(response))
  },
  transporter: nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SERVER_EMAIL,
      pass: process.env.SERVER_PASSWORD,
    },
  }),
  auth_verification_mail_path: "./back/files/vrfcsn_mail.html",
  front_file_uploads_path: "front/uploads/",
}
