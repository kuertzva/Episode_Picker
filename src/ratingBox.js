import React from 'react';
import MainButton from './mainButton.js';
import './static/ratingBox.scss';

function RatingBox(props) {

  return (
    <div id='rating-box'>
      <h4>Rating Factor:</h4>
      <div id='input-wrapper'>
        <input
          type='range'
          min={1}
          max={3}
          step={.1}
          value={props.rating}
          onChange={(e) => props.updateRating(e)}
        />
        <h5 id='left-label'> None </h5>
        <h5 id='right-label'> Max </h5>
      </div>
      <MainButton
        id='get-episode-button'
        title='Submit'
        action={() => props.changeEpisode('empty')}
        link={false}
      />
    </div>
  );
}

export default RatingBox;
