import React from 'react';
import LoadScreen from './loadScreen.js';
import SeasonBox from './seasonBox.js';
import RatingBox from './ratingBox.js';
import './static/details.scss';
import $ from 'jquery';

class Details extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // gather the seasons from server
    if (!props.jumpSeasons) {
    $.post('/details', {
      'show_id': this.props.show.id, "title": this.props.show.title,
      "image": this.props.show.image},
      (data) => {
        this.props.initSeasons(data);
        $.get('/update_show');
      });
    } else {
      props.toggleJumpSeaons();
      $.get('/update_show');
    }
  }

  render() {
    var input;

    // if loading
    if (this.props.loading) {
      input = (
        <div className='load-details'>
          <LoadScreen string='Loading'/>
        </div>
      );
    // make seasons
    } else {
      input = (
        <div
          id='details-input'
        >
          <SeasonBox
            seasons={this.props.seasons}
            updateSeasons={this.props.updateSeasons}
            toggleSeason={this.props.toggleSeason}
          />
          <RatingBox
            rating={this.props.rating}
            updateRating={this.props.updateRating}
            changeEpisode={this.props.changeEpisode}
          />
        </div>
      );
    }


    return (
      <div
        id='details-screen'
      >
        <div
          id="details-display"
        >
          <h3>{this.props.show.title}</h3>
          <img src={this.props.show.image}/>
        </div>
        {input}
      </div>
    )
  }


}

export default Details;
