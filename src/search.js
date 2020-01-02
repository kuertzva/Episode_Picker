import React from 'react';
import './static/search.scss';

function Search(props) {
  return(
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
          onClick={props.handleSubmit}
        >
          Search
        </button>
      </span>
    </div>
  )
}

export default Search;
