import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import _news_, { _news_c, _news_e } from "./components/_news_"
import reportWebVitals from "./reportWebVitals"

ReactDOM.render(
  <React.StrictMode>
    <App className="app-cls" />
    {/* <_news_
      title="TITLE"
      description="DESCRIPTION"
    />
    <_news_c />
    <_news_e
      title="TITLE"
      description="DESCRIPTION"
    /> */}
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
