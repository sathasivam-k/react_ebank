import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {userId: '', password: '', showError: false, errorMsg: ''}

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  fail = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  bankLogin = async event => {
    event.preventDefault()
    const {userId, password} = this.state
    const userDetails = {user_id: userId, pin: password}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.success(data.jwtToken)
    } else {
      this.fail(data.error_msg)
    }
  }

  render() {
    const {userId, password, showError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
          />
        </div>
        <form onSubmit={this.bankLogin}>
          <h1>Welcome Back!</h1>
          <div>
            <label htmlFor="user">User ID</label>
            <input
              id="user"
              placeholder="Enter User ID"
              type="text"
              value={userId}
              onChange={this.onChangeUserId}
            />
          </div>
          <div>
            <label htmlFor="pin">PIN</label>
            <input
              id="pin"
              placeholder="Enetr pin"
              type="password"
              value={password}
              onChange={this.onChangePassword}
            />
          </div>
          <button type="submit">Login</button>
          <div>{showError === true && <p>{errorMsg}</p>}</div>
        </form>
      </div>
    )
  }
}

export default Login
