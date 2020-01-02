import React from 'react';
import './static/start.scss';

function Start(props) {
  return (
    <div id='start-page'>
      <div id='past-searches' className='quick-showcase future-border'>
        <p>Past Searches: IN DEVELOPMENT</p>
        <div className='showcase'></div>
      </div>
      <div id='popular-searches' className='quick-showcase future-border'>
        <p>Popular Searches: IN DEVELOPMENT</p>
        <div className='showcase'></div>
      </div>
    </div>
  );
}

export default Start;
