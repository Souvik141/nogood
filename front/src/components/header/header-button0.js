import React from "react"

const HeaderUser = (props) => {
  const {authText, loggedIn, disableUserButton} = props
  return (
    <>
      <div
        className={
          "header-butt0" +
          (loggedIn ? " lgd" : " nlgd") +
          (disableUserButton ? " disable" : "")
        }
        onClick={() => {
          !loggedIn ? props.renderAuthForm() : props.renderDepiction()
        }}>
        <a className='header-text'>{authText}</a>
      </div>
      <div className={"header-butt-cln" + (loggedIn ? " lgd" : " nlgd")}></div>
    </>
  )
}

export default HeaderUser
