import "./footer.css"
import React from "react"

const Footer = (props) => {
  const parClassName = props.className ? " " + props.className : ""
  return (
    <div className={"footer" + parClassName}>
      <p>Copyright © 2021 OBLIVIOUS - All rights reserved</p>
    </div>
  )
}

export default Footer
