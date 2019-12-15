import React from 'react';
import './static/loadScreen.scss';

function LoadScreen(props) {
    return (
      <h3 className='loading'>
        {props.string}
        <span></span>
      </h3>
    );
}

export default LoadScreen;
