import AuthService from './Components/AuthService.jsx';
import ReactDOM from 'react-dom';
import HomepageApp from './Components/HomepageApp.jsx';
import CreateEventApp from './Components/CreateEventApp.jsx';
import EventList from './Components/EventList.jsx';
import EventPlanning from './Components/EventPlanning.jsx';
import Reminders from './Components/Reminders.jsx';
import Photos from './Components/Photos.jsx';
import WhatToBring from './Components/WhatToBring.jsx';
import Login from './Components/Login.jsx';
import {Router, Route, Link, browserHistory, IndexRoute, hashHistory} from 'react-router';
import React from 'react';


const auth = new AuthService('UdAHUOObXAJVQ4OUnMshhrCPzm59UoBx', 'ethanh1223.auth0.com');

const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    browserHistory.push('/login')
  }
};

var MakeMainRoutes = () => {
  return (
  <Router history={browserHistory}>
    <Route path="/" component={HomepageApp} auth={auth}> 
      <IndexRoute component={EventList} />
      <Route path="login" component={Login} />
      <Route path="create" component={CreateEventApp} onEnter={requireAuth} />
      <Route path="list" component={EventList}/> 
      <Route path="planning" component={EventPlanning}> 
        <Route path="reminders" component={Reminders} />
        <Route path="photos" component={Photos} />
        <Route path="what-to-bring" component={WhatToBring} />
      </Route>
    </Route>
  </Router>
  )
};

ReactDOM.render(<MakeMainRoutes />, document.getElementById('HomepageApp'))