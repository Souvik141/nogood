import "./App.css"
import Header from "./components/header/header.js"
import DefaultLandingPage from "./components/body/body.js"
import Footer from "./components/footer/footer.js"
import Loading from "./components/loading.js"
import Depiction from "./components/depiction/depiction.js"
// import AuthForm from "./components/authForm.js"
import React from "react"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      token: undefined,
      validated: false,
      loggedIn: false,
      userDetails: undefined,
      userDetailRetrieved: false,
      renderAuthForm: false,
      renderDepiction: false,
      disableUserButton: false,
    }
  }
  componentDidMount() {
    setTimeout(
      () =>
        this.setState({
          depictionLoading: false,
        }),
      1500
    )
    this._validateToken()
  }
  componentDidUpdate(prevProps, prevState) {
    if (!this.state.validated || prevState.token !== this.state.token) {
      this._validateToken()
    }
  }
  setToken(token) {
    if (token !== undefined) {
    }
  }
  getToken() {
    return localStorage.getItem("token")
  }
  obscureAuthForm() {
    this.setState({renderAuthForm: false})
  }
  async logUserOut() {
    if (
      this.state.userDetails !== undefined &&
      this.state.userDetails.email !== undefined
    ) {
      await fetch(
        "http://127.0.0.1:3000/api/auth/request-logout/" +
          this.state.userDetails.email,
        {
          method: "get",
        }
      ).then((response) => response.json())
    }
    localStorage.clear()
    this.setState({
      token: null,
      loggedIn: false,
      renderAuthForm: false,
      userDetails: undefined,
    })
  }
  async _validateToken() {
    var token = this.getToken()
    if (token !== null && !this.state.validated) {
      var responseJson = await fetch(
        "http://127.0.0.1:3000/api/auth/validate",
        {
          method: "get",
          headers: {"x-access-token": this.getToken()},
        }
      ).then((response) => response.json())

      console.log("PARENT")
      console.log(responseJson.data)
      if (responseJson.data !== undefined && responseJson.ahOh === undefined) {
        this.setState({
          userDetails: responseJson.data,
          userDetailRetrieved: true,
          validated: true,
          loggedIn: true,
        })
      } else {
        this.setState({
          userDetails: undefined,
          userDetailRetrieved: false,
          validated: false,
          loggedIn: false,
        })
      }
    }
  }
  render() {
    var headerClass = this.state.renderAuthForm ? "disable" : undefined
    var defaultLandingPageClass = this.state.renderAuthForm
      ? "disable"
      : undefined
    var footerClass = this.state.renderAuthForm ? "disable" : undefined
    var userDetails = this.state.userDetails
    return (
      /*!this.state.loading ? (<Loading />) :*/
      <div>
        {this.state.renderAuthForm && (
          <AuthForm
            className='login-form-onclick'
            obscureAuthForm={() => this.obscureAuthForm()}
            setToken={(token) => this.setToken(token)}
          />
        )}
        <Header
          renderAuthForm={() =>
            !this.state.loggedIn
              ? this.setState({renderAuthForm: true})
              : this.setState({renderAuthForm: false})
          }
          renderDepiction={() => {
            this.setState({
              disableUserButton: !this.state.disableUserButton,
              renderDepiction: !this.state.renderDepiction,
            })
            setTimeout(
              () => {
                this.setState({
                  disableUserButton: !this.state.disableUserButton,
                })
              },
              this.state.renderDepiction ? 300 : 1000
            )
          }}
          logUserOut={() => this.logUserOut()}
          className={headerClass}
          loggedIn={this.state.loggedIn}
          userDetails={this.state.userDetails}
          disableUserButton={this.state.disableUserButton}
        />
        {this.state.renderDepiction && (
          <Depiction
            userData={userDetails}
            reValidate={() => {
              this.setState({validated: false})
              this._validateToken()
            }}
            className={this.state.renderDepiction ? "s" : "e"}
            renderForm={this.state.renderDepiction}
            updating={() => {
              this.setState({
                disableUserButton: !this.state.disableUserButton,
              })
            }}
          />
        )}
        <DefaultLandingPage className={defaultLandingPageClass} />
        <Footer className={footerClass} />
      </div>
    )
  }
}

export default App
