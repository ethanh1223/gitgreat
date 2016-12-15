//Parent App within homepage.html
//Allows users to view events, create and view event planning details
import React from 'react';
import EventList from './EventList.jsx';
import EventPlanning from './EventPlanning.jsx';
import CreateEventApp from './CreateEventApp.jsx';
import {browserHistory} from 'react-router';
import Nav from './Nav.jsx';
import LoggedIn from './LoggedIn.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      featuredEvent: {}
    }
    this.handleEntryClick = this.handleEntryClick.bind(this);
    this.getEventData = this.getEventData.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
  }

  componentWillMount () {
    this.lock = new Auth0Lock('UdAHUOObXAJVQ4OUnMshhrCPzm59UoBx', 'ethanh1223.auth0.com');
    this.setState({idToken: this.getIdToken()});
  }

  getIdToken () {
    // First, check if there is already a JWT in local storage
    var idToken = localStorage.getItem('id_token');
    var authHash = this.lock.parseHash(window.location.hash);
    // If there is no JWT in local storage and there is one in the URL hash,
    // save it in local storage
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token
        localStorage.setItem('id_token', authHash.id_token);
      }
      if (authHash.error) {
        // Handle any error conditions
        console.log("Error signing in", authHash);
      }
    }
    return idToken;
  }

  handleEntryClick(event) {
    this.setState({
      featuredEvent: event,
    }, function() {
      browserHistory.push('/planning');
    });
  }

  getEventData(event) {
    this.setState({
      featuredEvent: event,
    }, function() {
      browserHistory.push('/planning');
    });
  }

render () {
    if (this.state.idToken) {
      return (
        <div>
          <Nav lock={this.lock} />
          <LoggedIn lock={this.lock} idToken={this.state.idToken} />
          {this.props.children && React.cloneElement(this.props.children, {
            featuredEvent: this.state.featuredEvent,
            handleEntryClick: this.handleEntryClick,
            getEventData: this.getEventData
          })}
        </div>
      )
    } else {
      return (
        <div>
          <Nav lock={this.lock} />
          {this.props.children && React.cloneElement(this.props.children, {
            featuredEvent: this.state.featuredEvent,
            handleEntryClick: this.handleEntryClick,
            getEventData: this.getEventData
          })}
        </div>
      )
    }
  }
  

  // render() {
  //   return (
  //     <div >
  //       <Nav lock={this.lock} />
  //       {this.props.children && React.cloneElement(this.props.children, {
  //         featuredEvent: this.state.featuredEvent,
  //         handleEntryClick: this.handleEntryClick,
  //         getEventData: this.getEventData
  //       })}
  //     </div>
  //   );
  // }
}

module.exports = App;