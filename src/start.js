import React from 'react';
import Suggestions from './suggestions.js';
import './static/start.scss';

function Start(props) {
  return (

    <div id='start-page'>
      <Suggestions
        setShow={props.setShow}
        user={null}
      />
    </div>
  );
}

export default Start;

/*
<div id='past-searches' className='quick-showcase future-border'>
  <p>Past Searches: IN DEVELOPMENT</p>
  <div className='showcase'></div>
</div>
*/
