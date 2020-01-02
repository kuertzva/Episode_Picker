import React from 'react';
import './static/season.scss';

function Season(props) {
  return (
    <p
      className={props.active}
      onClick={(e) => props.toggleSeason(e)}
      data-index={props.index}
    >
      {props.season.number}
    </p>
  )
}

export default Season;
