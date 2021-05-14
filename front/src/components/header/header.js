import "./header.css"
import {useState} from "react"
import {Container} from "react-bootstrap"
import HeaderUser from "./header-button0.js"
const header_username_length = 15

export default function Header(props) {
  const {
    className,
    loggedIn,
    renderAuthForm,
    logUserOut,
    userDetails,
    renderDepiction,
    disableUserButton,
  } = props
  var email = "ah oh!"
  if (userDetails && userDetails.email) {
    var index =
      userDetails.email.indexOf("@") === -1 ? 0 : userDetails.email.indexOf("@")
    index = index > header_username_length - 1 ? header_username_length : index
    email =
      userDetails.email.slice(0, index) +
      (userDetails.email.slice(0, userDetails.email.indexOf("@")).length >
      header_username_length
        ? "..."
        : "")
  }
  const parClassName = className ? " " + className : ""
  return (
    <header className={"header" + parClassName}>
      <Container>
        <a className='header-logo' href='/'>
          OBLIVIOUS
        </a>
        <div className='header-usr-div'>
          <HeaderUser
            loggedIn={loggedIn}
            renderAuthForm={() => renderAuthForm()}
            logUserOut={() => logUserOut()}
            renderDepiction={() => renderDepiction()}
            authText={loggedIn ? email : "Sign In"}
            disableUserButton={disableUserButton}
          />
        </div>
      </Container>
    </header>
  )
}
