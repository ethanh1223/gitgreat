var LoggedIn = React.createClass({
  getInitialState: function() {
    return {
      profile: null
    }
  },

  componentDidMount: function() {
    // The token is passed down from the App component 
    // and used to retrieve the profile
    this.props.lock.getProfile(this.props.idToken, function (err, profile) {
      if (err) {
        console.log("Error loading the Profile", err);
        return;
      }
      this.setState({profile: profile});
    }.bind(this));
  },

  callApi () {
    var getHome = fetch('/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('id_token')
      },
      method: 'GET',
      cache: false
    })

    getHome.then(function (response) {
      response.json().then(function (foos) {
        // Put the results on a property
        // to be displayed in the view
        console.log('the foos:', foos);
      })
    })
  },

  render: function() {
    if (this.state.profile) {
      return (
        <div className='showProfile'>
          <h2>Welcome {this.state.profile.nickname}</h2>
        </div>
      );
    } else {
      return (
        <div className="loading">Loading profile</div>
      );
    }
  }
});

module.exports = LoggedIn;