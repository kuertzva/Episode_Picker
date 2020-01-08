import React from 'react';
import './static/episode.scss';

function Episode(props) {
  return (
    <div id='episode-screen'>
      <div id='episode-top'>
        <h3>{'S' + props.episode.season + ' E' +
        props.episode.number + ': ' + props.episode.title}</h3>
        <img src={props.episode.image}/>
      </div>
      <div id='episode-bottom'>
        <p>{props.episode.summary}</p>
        <div id='episode-button-box'>
          <button
            id='reroll'
            className= 'future-border'
            onClick={props.reroll}
          >
            Different Episode
          </button>
          <button
            id='changeParams'
            className= 'future-border'
            onClick={props.changeParams}
          >
            Change Parameters
          </button>
        </div>
      </div>
    </div>
  );
}

export default Episode;
