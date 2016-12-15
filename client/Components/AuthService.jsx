import ExecutionEnvironment from 'exenv'
import React from 'react'
import { isTokenExpired } from './jwtHelper.jsx'

class AuthService extends React.Component {
  constructor(clientId, domain) {
    super();
      this.lock = new Auth0Lock(clientId, domain, {
        auth: {
          redirectUrl: 'http://localhost:3000/login',
          responseType: 'token'
          // redirect: false
        }
      })
      // Add callback for lock `authenticated` event
      this.lock.on('authenticated', this._doAuthentication.bind(this))
      // binds login functions to keep this context
      this.login = this.login.bind(this)
      // Configure Auth0 (DONE IN COMPONENTWILLMOUNT INSTEAD)

  };

  // componentDidMount() {
  //   this.setState({idToken: this.getIdToken()})
  // }

  _doAuthentication(authResult) {
    console.log('I RAN');
    window.alert('OMG')
    // Saves the user token
    localStorage.setItem('token',authResult.idToken);
    // navigate to the home route
    browserHistory.replace('/')
    //MAY NEED TO REDIRECT ELSEWHERE
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    console.log(token);
    console.log(isTokenExpired(token));
    return !!token && isTokenExpired(token)
  }

  getToken() {
    // Retrieves the user token from local storage
    var idToken = localStorage.getItem('id_token');
    var authHash = this.lock.parseHash(window.location.hash);

    // console.log(idToken)
    // console.log(authHash)

    if (!idToken && authHash) {
      // console.log(authHash.id_token)
      if (authHash.id_token) {
        idToken = authHash.id_token
        localStorage.setItem('id_token', authHash.id_token);
      }
      if (authHash.error) {
        // Handle any error conditions
        console.log("Error signing in", authHash);
      }
    }

    return idToken

  }

  logout() {
    // Clear user token and profile data from local storage
    localStorage.removeItem('id_token');
  }
};

module.exports = AuthService;