import React from "react"
import ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import store from './store'
import "./index.css"
import App from "./App"
import _news_, {_news_c, _news_e} from "./components/_news_"
import reportWebVitals from "./reportWebVitals"
//trial and error
import Depiction from "./components/depiction/depiction.js"
console.log(require("dotenv").config())
ReactDOM.render(
  <Provider className='app-cls' store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
