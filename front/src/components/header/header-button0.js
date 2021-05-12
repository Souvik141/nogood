import React from "react"
import logo from "./logo.svg"

const HeaderUser = (props) => {
  const {authText, loggedIn, disableUserButton} = props
  return (
    <>
      <div
        className={'hdr-butt0' + (loggedIn ? " lgd":" nlgd") + (disableUserButton ? " disable":"")}
        onClick={() => {
          !loggedIn?
          props.renderAuthForm()
          :props.renderDepiction();
        }}>
        <img src={logo} className='hdr-user-logo' alt='logo' />
        <a className='hdr-text'>{authText}</a>
      </div>
      <div className={'hdr-butt-cln' + (loggedIn ? " lgd":" nlgd")}></div>
    </>
  )
}

export default HeaderUser
