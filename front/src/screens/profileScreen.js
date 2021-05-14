import "../styles/depiction.css"
import axios from "axios"
import {Component} from "react"
import imageCompression from "browser-image-compression"

const getToken = () => {
  return localStorage.getItem("token")
}

const profileScreen = () => {
  return (
    <div className='dpctn-bgnd'>
      <form className='dpctn-frm'>
        <div className='img-cntnr'>
          <input
            type='image'
            //   src={this.state.imgSrc}
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
              onChange={
                (event) => {}
                //   this.setState({
                //       firstName: event.target.value,
                //   })
              }
              className='form-field'
              //   value={this.state.firstName}
            />
          </div>
          <div className='frm-dvs'>
            <label for='midlname' className='form-field'>
              middle name
            </label>
            <input
              id='midlname'
              type='text'
              onChange={
                (event) => {}
                //   this.setState({
                //       midlName: event.target.value,
                //   })
              }
              className='form-field'
              //   value={this.state.midlName}
            />
          </div>
          <div className='frm-dvs'>
            <label for='lastname' className='form-field'>
              last name
            </label>
            <input
              id='lastname'
              type='text'
              onChange={
                (event) => {}
                //   this.setState({
                //       lastName: event.target.value,
                //   })
              }
              className='form-field'
              //   value={this.state.lastName}
            />
          </div>
          <div className='frm-dvs'>
            <label for='dob' className='form-field'>
              date of birth
            </label>
            <input
              id='dob'
              type='date'
              onChange={
                (event) => {}
                //   this.setState({
                //       dateOfBirth: event.target.value,
                //   })
              }
              className='form-field dt'
              //   value={this.state.dateOfBirth}
            />
          </div>
        </div>
        <input
          type='button'
          value='ADJUST'
          onClick={() => {
            this.props.updating()
            //   _updateInfo(this.state, userData)
            setTimeout(() => {
              this.props.updating()
            }, 1500)
          }}
          className='data-mod'
        />
      </form>
    </div>
  )
}

export default profileScreen
