import React from 'react';
import LoadScreen from './loadScreen.js';
import MainButton from './mainButton.js';
import $ from 'jquery';
import './static/episode.scss';

class Episode extends React.Component {
  constructor(props) {
    super(props);
    this.generateEpisode = this.generateEpisode.bind(this);
  }

  generateEpisode() {

    // find active seasons for search
    var active_seasons = [];
    var season;
    for(season of this.props.seasons) {
      if(season.active) {
        active_seasons.push(season.number);
      }
    }

    //console.log(active_seasons);

    // get episode
    $.post('/episode', { season_list: active_seasons, ratingFactor: this.props.rating
    }, (data) => {
      //format seasons
      console.log('data received');
      this.props.changeEpisode(data);
      console.log('data formatted');
    });
  }

  componentDidMount() {
    if (this.props.episode === 'empty') {
      this.generateEpisode();
    }
  }

  render() {
    if (this.props.episode === 'empty') {
      return (
        <div id='load-episode'>
          <LoadScreen
            string='Loading'
          />
        </div>

      )
    } else {
      return (
        <div id='episode-screen'>
          <div id='episode-top'>
            <h3>{'S' + this.props.episode.season + ' E' +
            this.props.episode.number + ': ' + this.props.episode.title}</h3>
            <img src={this.props.episode.image}/>
          </div>
          <div id='episode-bottom'>
            <p>{this.props.episode.summary}</p>
            <div id='episode-button-box'>
              <MainButton
                id='different-episode-button'
                title='Different Episode'
                action={() => this.props.changeEpisode('empty')}
                link={false}
              />
              <MainButton
                id='change-params-button'
                title='Change Parameters'
                action={this.props.changeParams}
                link={false}
              />
            </div>
          </div>
        </div>
    );}
  }
}

export default Episode;
