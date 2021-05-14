import "./body.css"
import ConvoSection from "./ConvoSection"
import React from "react"

//Everyone will be able to see everyone's conversation subject
//anyone will be able to make contribution to it, the conversation subject giver will validate
//If relevant it will be highlighted for the loggedin user
//Can sort by username
//Anonymous conversation subject posting must go through admin approval first
//Anyone can report any user
//Anyone can report any conversation subject

export default class DefaultLandingPage extends React.Component {
  render() {
    const parClassName = this.props.className ? " " + this.props.className : ""
    return (
      <div className={"dflt-lndng" + parClassName}>
        <div className='convo-sctn'>
          <ConvoSection />
        </div>
      </div>
    )
  }
}
