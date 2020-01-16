import React from 'react';
import './static/suggestedShow.scss';

function SuggestedShow(props) {

  return (
    <div
      data-id={props.show.link}
      data-title={props.show.title}
      key={props.show.id}
      data-image={props.show.image}
      onClick={(e) => props.onClick(e)}
      className="suggested-show"
    >
      <h3> {props.show.title} </h3>
      <img src={props.show.image}/>
    </div>

  )

}

export default SuggestedShow;
