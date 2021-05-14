import axios from "axios"
import {Component} from "react"
import imageCompression from "browser-image-compression"
const config = require("../component-config")

async function _updateInfo(state, userData) {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  }
  const data = new FormData()
  data.append("email", state.email)
  if (state.firstName !== userData.firstName)
    data.append("firstName", state.firstName)
  if (state.midlName !== userData.middleName)
    data.append("middleName", state.midlName)
  if (state.lastName !== userData.lastName)
    data.append("lastName", state.lastName)
  if (state.dateOfBirth !== userData.dateOfBirth)
    data.append("dob", state.dateOfBirth)
  if (state.imageChanged) data.append("file", state.file)
  data.forEach(function (value, key) {
    console.log("Key:" + key + "->Value:" + value)
  })
  axios
    .put("http://127.0.0.1:3000/api/profile/update-depiction", data, config)
    .then((res) => {})
}
const arrayBufferToBase64 = (buffer) => {
  var binary = ""
  var bytes = [].slice.call(new Uint8Array(buffer))
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return window.btoa(binary)
}
async function _callUserInfo(userData) {
  console.log("get image")
  console.log(userData)
  if (userData && userData.Image_Id) {
    var endPoint =
      "http://127.0.0.1:3000/api/profile/get-image?id=" + userData.Image_Id
    return await fetch(endPoint)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.img) {
          var base64Flag = "data:image/jpeg;base64,"
          var imageStr = arrayBufferToBase64(data.data.img.data.data)
          return base64Flag + imageStr
        }
      })
  }
}
export default class Depiction extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      imgSrc: null,
      firstName: null,
      midlName: null,
      lastName: null,
      dateOfBirth: null,
      email: null,
      imageChanged: false,
    }
  }
  async componentDidMount() {
    // this.props.reValidate()
    var imgSrc = await _callUserInfo(this.props.userData)
    if (this.props.userData) {
      this.setState({
        imgSrc: imgSrc ? imgSrc : this.state.imgSrc,
        firstName: this.props.userData.firstName,
        midlName: this.props.userData.middleName,
        lastName: this.props.userData.lastName,
        dateOfBirth: this.props.userData.dateOfBirth,
        email: this.props.userData.email,
      })
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.userData !== prevProps.userData) {
      this.setState({
        firstName: this.props.userData.firstName,
        midlName: this.props.userData.middleName,
        lastName: this.props.userData.lastName,
        dateOfBirth: this.props.userData.dateOfBirth,
        email: this.props.userData.email,
      })
    }
  }
  _handleChange = async (event) => {
    if (event.target.files !== undefined && event.target.files.length > 0) {
      const file = event.target.files[0]
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }
      const compressedFile = await imageCompression(file, options)
      const reader = new FileReader()
      reader.readAsDataURL(compressedFile)
      reader.onload = () =>
        this.setState({
          file: compressedFile,
          imgSrc: reader.result,
          imageChanged: true,
        })
    }
  }
  render() {
    const {userData} = this.props
    var formClsXtn = ""
    if (userData && userData.firstName && !this.state.firstName) {
      this.setState({
        firstName: userData.firstName,
      })
    }
    if (userData && userData.middleName && !this.state.midlName) {
      this.setState({
        midlName: userData.middleName,
      })
    }
    if (userData && userData.lastName && !this.state.lastName) {
      this.setState({
        lastName: userData.lastName,
      })
    }
    if (this.state.file && !this.state.imgSrc) {
      const reader = new FileReader()
      reader.readAsDataURL(this.state.file)
      reader.onload = () =>
        this.setState({
          imgSrc: reader.result,
        })
    }
    return (
      <div className={"dpctn-bgnd " + this.props.className}>
        {this.props.renderForm && (
          <form className={"dpctn-frm" + formClsXtn}>
            <div className='img-cntnr'>
              <input
                type='image'
                src={this.state.imgSrc}
                alt='your image'
                className='img-prvw'
              />
              <input
                type='file'
                name='user[image]'
                accept='.jpg, .png'
                autoComplete='off'
                autoFocus='autofocus'
                onChange={(event) => this._handleChange(event)}
                className='img-upld'
                dataButtonText='Choose'
              />
            </div>
            <div className='ntt-dtls'>
              <div className='frm-dvs'>
                <label for='firstname' className='form-field'>
                  first name
                </label>
                <input
                  id='firstname'
                  type='text'
                  onChange={(event) =>
                    this.setState({
                      firstName: event.target.value,
                    })
                  }
                  className='form-field'
                  value={this.state.firstName}
                />
              </div>
              <div className='frm-dvs'>
                <label for='midlname' className='form-field'>
                  middle name
                </label>
                <input
                  id='midlname'
                  type='text'
                  onChange={(event) =>
                    this.setState({
                      midlName: event.target.value,
                    })
                  }
                  className='form-field'
                  value={this.state.midlName}
                />
              </div>
              <div className='frm-dvs'>
                <label for='lastname' className='form-field'>
                  last name
                </label>
                <input
                  id='lastname'
                  type='text'
                  onChange={(event) =>
                    this.setState({
                      lastName: event.target.value,
                    })
                  }
                  className='form-field'
                  value={this.state.lastName}
                />
              </div>
              <div className='frm-dvs'>
                <label for='dob' className='form-field'>
                  date of birth
                </label>
                <input
                  id='dob'
                  type='date'
                  onChange={(event) =>
                    this.setState({
                      dateOfBirth: event.target.value,
                    })
                  }
                  className='form-field dt'
                  value={this.state.dateOfBirth}
                />
              </div>
            </div>
            <input
              type='button'
              value='ADJUST'
              onClick={() => {
                this.props.updating()
                _updateInfo(this.state, userData)
                setTimeout(() => {
                  this.props.updating()
                }, 1500)
              }}
              className='data-mod'
            />
          </form>
        )}
      </div>
    )
  }
}
