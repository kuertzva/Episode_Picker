import React from 'react';
import './static/start.scss';

function Start(props) {
  return (
    <div id='start-page'>
      <div id='search-section'>
        <span>
          <label for='search'> Show: </label>
          <input
            type='text'
            name='search'
            onChange={(e) => props.handleChange(e)}
            value={props.query}
          />
          <button
            className= "future-border"
            onClick={props.handleSearch}
          >
            Search
          </button>
        </span>
      </div>
      <div id='past-searches' className='quick-showcase'
      className="future-border">
        <p>Past Searches: IN DEVELOPMENT</p>
        <div className='showcase'></div>
      </div>
      <div id='popular-searches' className='quick-showcase'
      className="future-border">
        <p>Popular Searches: IN DEVELOPMENT</p>
        <div className='showcase'></div>
      </div>
    </div>
  );
}

export default Start;
