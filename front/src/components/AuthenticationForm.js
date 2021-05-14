import e from "cors"
import {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  loginUser,
  registerUser,
  changePassword,
} from "../actions/userActions.js"

// const requestRegistration = () => {}
// const requestPasswordChange = () => {}

const validate = () => {
    return true;
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
    if (!this.state.commEml || !this.state.commPwd || !this.state.regRtypePwd) {
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

const AuthForm = (props) => {
    const dispatch = useDispatch()
  const [email, setEmail] = useState(undefined)
  const [password, setPassword] = useState(undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [retypedPassword, setRetypedPassword] = useState(undefined)
  const [renderedForm, setRenderedForm] = useState("Sign in")
  const [error, setError] = useState(undefined)
  const userLogin = useSelector((state) => state.userLogin)
  const submitSignIn = () => {
    if (validate()) {
        dispatch(loginUser(email, password))
        const { userInfo } = userLogin
        userInfo ? window.location.reload() : alert("Unable to sign you in");
      // if (responseJson.description.message_code === "022") {
      //     this.setState({validationError: responseJson.description.message})
      //     return
      // }
      // if (responseJson.data !== undefined) {
      //     setToken(responseJson.data.token)
      // }
    }
  }
  return (
    <>
      <div className='cmn-auth-bgnd login-form-onclick'>
        <div className='auth-form'>
          <h2
            style={{
              alignSelf: "flex-start",
              marginBlockStart: "0em",
              marginBlockEnd: "0.3em",
              fontFamily: "Segoe UI",
            }}>
            {renderedForm}
          </h2>
          {error && (
            <div className='message-block e'>
              <p className='message'>{error}</p>
            </div>
          )}
          <form className='cmn-auth-frm' autoComplete='on'>
            <input
              type='email'
              placeholder='enter your email address'
              onChange={(event) => setEmail(event.target.value)}
              className='form-email txt'
              key='email'
              autoFocus='autofocus'
            />
            {(renderedForm === "Sign in" || renderedForm === "Register") && (
              <input
                type={showPassword ? "text" : "password"}
                placeholder='enter your password'
                onChange={(event) => setPassword(event.target.value)}
                className='form-pwd txt'
                key='password'
              />
            )}
            {renderedForm === "Sign in" && (
              <div
                className={"show-pwd" + (showPassword ? " show-pwd-t" : "")}
                onMouseDown={() => setShowPassword(true)}
                onClick={() => setShowPassword(false)}
              />
            )}
            {renderedForm === "Register" && (
              <input
                type='text'
                placeholder='re-enter your password'
                onChange={(event) => setRetypedPassword(event.target.value)}
                className='form-pwd txt'
                key='re-password'
              />
            )}
            <input
              className='form-submit'
              onClick={(event) => {
                event.preventDefault()
                if (renderedForm === "Sign in") submitSignIn()
                // else if(renderedForm === "Register") requestRegistration()
                // else if(renderedForm === "Forgot password?") requestPasswordChange()
              }}
              type='submit'
              value='Submit'
            />
          </form>
          <div className='auth-xtras'>
            <a
              key='left-link'
              onClick={() =>
                setRenderedForm(
                  renderedForm === "Sign in" ? "Register" : "Sign in"
                )
              }>
              {renderedForm === "Sign in" ? "Register" : "Sign in"}
            </a>
            <a
              key='right-link'
              onClick={() =>
                setRenderedForm(
                  renderedForm === "Forgot password?"
                    ? "Register"
                    : "Forgot password?"
                )
              }>
              {renderedForm === "Forgot password?"
                ? "Register"
                : "Forgot password?"}
            </a>
          </div>
        </div>
      </div>
      <div className='login-form-onclick login-form-onclick-clone'>
        <div
          className='xclose-button'
          onClick={() => props.obscureAuthForm()}></div>
      </div>
    </>
  )
}
export default AuthForm
