import {useState} from "react"
const ConvoContribution = (props) => {
  return (
    <div className={"cnv-cntrb" + (props.isSelf ? " slf" : "")}>
      <p
        style={{
          fontWeight: "bold",
          marginBottom: "3px",
        }}>
        Phil's contribution:
      </p>
      <p
        style={{
          paddingLeft: "10px",
        }}>
        Pariatur velit ut culpa cupidatat minim ipsum adipisicing ipsum qui
        anim. Ut mollit et in ut commodo esse quis voluptate. Consectetur velit
        aliqua proident culpa et do magna dolor ullamco. Duis ipsum
        reprehenderit anim pariatur in dolor sint ex elit labore sint esse
        consectetur. Sit ullamco Lorem non amet fugiat sunt dolore elit aliqua
        nostrud aliquip Lorem. Exercitation veniam nulla eu deserunt eiusmod id
        eu est eiusmod.
      </p>
    </div>
  )
}
const ConvoSection = (props) => {
  var convoList = []
  const SomeName = "Sav"
  var flag = true
  for (var i = 0; i < 3; i++) {
    convoList.push(<ConvoContribution isSelf={flag} />)
    flag = false
  }
  return (
    <div className='convo'>
      <h3 className='owner'>Some One</h3>
      <p className='to'>to {SomeName}</p>
      <h1 className='cnv-sbjct'>Conversation subject</h1>
      <p className='cnv-smry'>Conversation summery</p>
      <div className='cnv-cntrb-lst'>{convoList}</div>
    </div>
  )
}
export default ConvoSection
