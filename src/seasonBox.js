import React from 'react';
import Season from './season.js';
import './static/seasonBox.scss';

function SeasonBox(props) {

  function toggleSeason(e) {
    const index = e.target.getAttribute('data-index');
    props.toggleSeason(index);
  }

  function makeSeason(season) {

    var index = props.seasons.indexOf(season);
    return (
      <Season
        season={season}
        active={'season ' +
        (season.active? 's-active' : 's-inactive')}
        key={index}
        index={index}
        toggleSeason={toggleSeason}
      />
    );
  }

  var contents = props.seasons.map(season =>(
    makeSeason(season)
  ));

  return (
    <div
      id='season-box'
    >
      <h4>Seasons:</h4>
      <div id='seasons'>
        {contents}
      </div>
    </div>
  );
}

export default SeasonBox;
