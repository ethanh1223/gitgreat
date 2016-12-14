import React from 'react';
import WhatToBring from './WhatToBring.jsx';
import Activities from './Activities.jsx';
import Reminders from './Reminders.jsx';
import Photos from './Photos.jsx';
import FeatureNavigation from './FeatureNavigation.jsx';

//Child component contained within HomepageApp
//Contains the event planning navigation bar
class EventPlanning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: false
    };

    this.changeTabDisplay = this.changeTabDisplay.bind(this);
  }

  changeTabDisplay(e) {
    this.setState({
      tab: e.target.value
    });
  }

  render() {
    var view;
    if (this.state.tab === 'whatToBringBtn') {
      view = <WhatToBring featuredEvent={this.props.featuredEvent}/>;
    } else if (this.state.tab === 'activitiesBtn') {
      view = <Activities />;
    } else if (this.state.tab === 'reminderBtn') {
      view = <Reminders featuredEvent={this.props.featuredEvent}/>;
    } else if (this.state.tab === 'photosBtn') {
     view = <Photos uploadFile={this.uploadFile} />;
    }
    return (
      <div>
        <h1 className="eventHeader">{this.props.featuredEvent.name} | {this.props.featuredEvent.where} | {this.props.featuredEvent.when}</h1>
        <FeatureNavigation changeDisplay={this.changeTabDisplay} />
        {view}
      </div>
    );
  }
}
module.exports = EventPlanning;

