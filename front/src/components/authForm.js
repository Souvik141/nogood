import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {loginUser} from "../actions/userActions.js"

async function _registerUser(eml, pwd, call) {
  var responseJson = await fetch("api/auth/request-registration", {
    method: "post",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: eml,
      password: pwd,
    }),
  }).then((response) => response.json())
  if (
    responseJson.description.message_code === "001" ||
    responseJson.description.message_code === "002"
  ) {
    return call(responseJson.description.message)
  }
  if (responseJson.description.message_code === "003")
    call("Registration requested, please verify your mail id")
  return await fetch(
    process.env.SERVER_DOMAIN +
      "api/auth/generate-verification-code?email=" +
      encodeURI(eml),
    {
      method: "get",
    }
  ).then((response) => response.json())
}

const _validationTxt = (props) => {
  const {typ, txt} = props
  return (
    <div className={"message-block " + typ}>
      <p className='message'>{txt}</p>
    </div>
  )
}

const _endButt = (props) => {
  const {render, handleClick, buttonTxt, keyVal} = props
  return (
    <a
      key={keyVal}
      onClick={() => {
        if (render === "login") handleClick("login")
        if (render === "registration") handleClick("registration")
        if (render === "forgotpwd") handleClick("forgotpwd")
      }}>
      {buttonTxt}
    </a>
  )
}

const _form = (props) => {
  const {formType, onEmlChng, onPwdChng, onRtypePwdChng} = props
  const [shwPwd, setShwPwd] = useState(false)
  var innerElems = []
  var inputElem = (
    fieldtype,
    placeholder,
    onchangemethod,
    classname,
    key,
    autoFocus
  ) => {
    return (
      <input
        type={fieldtype}
        placeholder={placeholder}
        onChange={onchangemethod}
        className={classname}
        autoComplete='on'
        key={key}
        autoFocus={autoFocus ? "autofocus" : ""}
      />
    )
  }
  var shwPwdButt = () => {
    return (
      <div
        className={"show-pwd" + (shwPwd ? " show-pwd-t" : "")}
        onMouseDown={() => {
          setShwPwd(true)
        }}
        onClick={() => {
          setShwPwd(false)
        }}
      />
    )
  }
  innerElems.push(
    inputElem(
      "email",
      "enter your email address",
      onEmlChng,
      "form-email txt",
      "eml",
      true
    )
  )
  if (formType === "forgotpwd") return innerElems
  innerElems.push(
    inputElem(
      shwPwd ? "text" : "password",
      "enter your password",
      onPwdChng,
      "form-pwd txt",
      "pwd"
    )
  )
  if (formType === "login") {
    innerElems.push(shwPwdButt())
    return innerElems
  }
  innerElems.push(
    inputElem(
      "text",
      "re-enter your password",
      onRtypePwdChng,
      "form-pwd txt",
      "rpwd"
    )
  )
  return innerElems
}

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      commEml: undefined,
      commPwd: undefined,
      regRtypePwd: undefined,
      renderedForm: "login",
      validationError: undefined,
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.renderedForm !== this.state.renderedForm) {
      this.setState({
        apiResTyp: false,
        apiResTxt: undefined,
        validationError: undefined,
      })
    }
  }
  onEmlChng = (event) => {
    this.setState({
      commEml: event.target.value,
      apiResTyp: false,
    })
  }
  onPwdChng = (event) => {
    this.setState({
      commPwd: event.target.value,
      apiResTyp: false,
    })
  }
  onRtypePwdChng = (event) => {
    this.setState({
      regRtypePwd: event.target.value,
    })
  }
  _validate() {
    var mailFormat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    var flag = true
    if (this.state.renderedForm === "forgotpwd") {
      if (!this.state.commEml) {
        this.setState({
          validationError: "You need to provide the email address",
        })
        return false
      }
      if (!this.state.commEml.match(mailFormat)) {
        this.setState({validationError: "Please provide a valid email address"})
        return false
      }
    }
    if (this.state.renderedForm === "login") {
      if (!this.state.commEml || !this.state.commPwd) {
        this.setState({
          validationError: "Please fill up all the following fields",
        })
        return false
      }
      if (!this.state.commEml.match(mailFormat)) {
        this.setState({validationError: "Please provide a valid email address"})
        return false
      }
    }
    if (this.state.renderedForm === "registration") {
      if (
        !this.state.commEml ||
        !this.state.commPwd ||
        !this.state.regRtypePwd
      ) {
        this.setState({
          validationError: "Please fill up all the following fields",
        })
        return false
      }
      if (this.state.commPwd !== this.state.regRtypePwd) {
        this.setState({validationError: "Passwords are not matching!"})
        return false
      }
    }
    return flag
  }
  onSubmitSignIn = async (event) => {
    event.preventDefault()
    const {setToken} = this.props
    if (this._validate() && this.state.renderedForm === "login") {
      const responseJson = await loginUser(
        this.state.commEml,
        this.state.commPwd
      )
      if (responseJson.description.message_code === "022") {
        this.setState({validationError: responseJson.description.message})
        return
      }
      if (responseJson.data !== undefined) {
        setToken(responseJson.data.token)
      }
    }
  }
  onSubmitRegistration = async (event) => {
    event.preventDefault()
    if (this._validate() && this.state.renderedForm === "registration") {
      const responseJson = await _registerUser(
        this.state.commEml,
        this.state.commPwd,
        (message) => {
          this.setState({
            validationError: message,
          })
        }
      )
    }
  }
  onSubmitForgotPwd = async (event) => {
    event.preventDefault()
    if (this._validate() && this.state.renderedForm === "forgotpwd") {
      const responseJson = await _registerUser(
        this.state.commEml,
        (message) => {
          this.setState({
            validationError: message,
          })
        }
      )
    }
  }
  render() {
    const {className} = this.props
    const parClassName = className ? " " + className : ""
    const {obscureAuthForm} = this.props
    var heading = "ah oh!"
    var leftlink = "ah oh!"
    var leftlinkActn
    var rightlink = "ah oh!"
    var rightlinkActn
    var frm_clsname = ""
    var sbmt_btn_actn
    var sbmt_btn_txt = "ah oh!"
    var sbmt_cls_nme = ""
    if (this.state.renderedForm === "login") {
      heading = "You know what to do!"
      leftlink = "register self"
      leftlinkActn = "registration"
      rightlink = "forgot password?"
      rightlinkActn = "forgotpwd"
      frm_clsname = "lgin-frm"
      sbmt_btn_actn = this.onSubmitSignIn
      sbmt_btn_txt = "SIGN IN"
      sbmt_cls_nme = "sgn-n-butt"
    } else if (this.state.renderedForm === "registration") {
      heading = "Register Self"
      leftlink = "try signing in"
      leftlinkActn = "login"
      rightlink = "forgot password?"
      rightlinkActn = "forgotpwd"
      frm_clsname = "rgstrsn-frm"
      sbmt_btn_actn = this.onSubmitRegistration
      sbmt_btn_txt = "REGISTER"
      sbmt_cls_nme = "rgstr-butt"
    } else if (this.state.renderedForm === "forgotpwd") {
      heading = "Reset password"
      leftlink = "try signing in"
      leftlinkActn = "login"
      rightlink = "register self"
      rightlinkActn = "registration"
      frm_clsname = "fgtpwd-frm"
      sbmt_btn_actn = this.onSubmitForgotPwd
      sbmt_btn_txt = "VERIFY"
      sbmt_cls_nme = "frgt-pwd-butt"
    }
    const lft = "lft",
      rght = "rght"
    var authForm = React.createElement(
      "div",
      {className: "cmn-auth-bgnd login-form-onclick"},
      React.createElement(
        "div",
        {className: "auth-form"},
        React.createElement(
          "h2",
          {
            style: {
              alignSelf: "flex-start",
              marginBlockStart: "0em",
              marginBlockEnd: "0.3em",
              fontFamily: "Segoe UI",
            },
          },
          heading
        ),
        this.state.validationError && (
          <_validationTxt txt={this.state.validationError} typ='e' />
        ),
        React.createElement(
          "form",
          {
            className: "cmn-auth-frm " + frm_clsname,
            autoComplete: "on",
          },
          <_form
            formType={this.state.renderedForm}
            onEmlChng={this.onEmlChng}
            onPwdChng={this.onPwdChng}
            onRtypePwdChng={this.onRtypePwdChng}
          />,
          <input
            className={"form-submit " + sbmt_cls_nme}
            onClick={sbmt_btn_actn}
            type='submit'
            value={sbmt_btn_txt}
          />
        ),
        React.createElement(
          "div",
          {className: "auth-xtras"},
          <a
            key={lft}
            onClick={() => this.setState({renderedForm: leftlinkActn})}>
            {leftlink}
          </a>,
          <a
            key={rght}
            onClick={() => this.setState({renderedForm: rightlinkActn})}>
            {rightlink}
          </a>
        )
      )
    )
    return (
      <>
        {authForm}
        <div className={"login-form-onclick login-form-onclick-clone"}>
          <div
            className='xclose-button'
            onClick={() => obscureAuthForm()}></div>
        </div>
      </>
    )
  }
}
