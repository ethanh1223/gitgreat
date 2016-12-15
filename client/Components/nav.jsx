//Child component within the HomepageApp and the CreateEventApp to toggle
//between the two App pages.
import React from 'react';
import {Link} from 'react-router';

class Nav extends React.Component {

  constructor (props) {
    super(props);
    this.showLock=this.showLock.bind(this);
    this.logOut=this.logOut.bind(this);
  }

  logOut () {
    localStorage.removeItem('id_token');
  }

  showLock () {
    // Show the Auth0Lock widget
    this.props.lock.show();
  }

  render () {
    return (
      <div className="nav">
        <Link to={'/'} className='title'>Friends</Link>
        <Link to={'/'}>Home </Link>
        <Link to={'/create'} >Create Event</Link>
        <button onClick={this.showLock}>Log In</button>
        <button onClick={this.logOut}>Log Out</button>
      </div>
    );  
  }
}

module.exports = Nav;