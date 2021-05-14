import "./styles/app.css"
import "./styles/auth.css"
import "./styles/depiction.css"
import React, {useState, useEffect} from "react"
import {BrowserRouter as Router, Route} from "react-router-dom"
import {Container} from "react-bootstrap"
import Header from "./components/header/header.js"
import DefaultLandingPage from "./components/body/body.js"
import Footer from "./components/footer/footer.js"
import Loading from "./components/loading.js"
import Depiction from "./components/depiction/depiction.js"
import AuthForm from "./components/AuthenticationForm.js"
import ProfileScreen from "./screens/profileScreen"

const getToken = () => {
  return localStorage.getItem("token")
}

const App = (props) => {
  const [token, setToken] = useState(undefined)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userDetails, setUserDetails] = useState(false)
  const [renderAuthForm, setRenderAuthForm] = useState(false)
  const [renderDepiction, setRenderDepiction] = useState(false)
  const [disableUserButton, setDisableUserButton] = useState(false)
  useEffect(() => {
    console.log(token)
    if (token !== undefined) {
      localStorage.setItem("token", token)
      setToken(token)
      setLoggedIn(true)
      setRenderAuthForm(false)
    }
  })
  return (
    <Router>
      {renderAuthForm && (
        <AuthForm
          obscureAuthForm={() => setRenderAuthForm(false)}
          setToken={(token) => setToken(token)}
        />
      )}
      <Header
        className={renderAuthForm && "disable"}
        renderAuthForm={() => setRenderAuthForm(!loggedIn)}
        renderDepiction={() => {
          setDisableUserButton(!disableUserButton)
          setRenderDepiction(!renderDepiction)
          setTimeout(
            () => setDisableUserButton(!disableUserButton),
            this.state.renderDepiction ? 300 : 1000
          )
        }}
        logUserOut={() => this.logUserOut()}
        loggedIn={loggedIn}
        userDetails={userDetails}
        disableUserButton={disableUserButton}
      />
      <main>
        <Container>
          <Route path='/profile' component={ProfileScreen} />
          {/* <Route path='/order/:id' component={OrderScreen} />
            <Route path='/shipping' component={ShippingScreen} />
            <Route path='/payment' component={PaymentScreen} />
            <Route path='/placeorder' component={PlaceOrderScreen} />
            <Route path='/login' component={LoginScreen} />
            <Route path='/register' component={RegisterScreen} />
            <Route path='/product/:id' component={ProductScreen} />
            <Route path='/cart/:id?' component={CartScreen} />
            <Route path='/admin/userlist' component={UserListScreen} />
            <Route path='/admin/user/:id/edit' component={UserEditScreen} />
            <Route
              path='/admin/productlist'
              component={ProductListScreen}
              exact
            />
            <Route
              path='/admin/productlist/:pageNumber'
              component={ProductListScreen}
              exact
            />
            <Route path='/admin/product/:id/edit' component={ProductEditScreen} />
            <Route path='/admin/orderlist' component={OrderListScreen} />
            <Route path='/search/:keyword' component={HomeScreen} exact />
            <Route path='/page/:pageNumber' component={HomeScreen} exact />
            <Route
              path='/search/:keyword/page/:pageNumber'
              component={HomeScreen}
              exact
            />
            <Route path='/' component={HomeScreen} exact /> */}
        </Container>
      </main>
      <Footer className={renderAuthForm && "disable"} />
    </Router>
  )
}

export default App
