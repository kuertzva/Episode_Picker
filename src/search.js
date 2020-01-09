import React from 'react';
import MainButton from './mainButton.js';
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
        <MainButton
          id='search-button'
          title='Search'
          action={props.handleSubmit}
          link={false}
        />
      </span>
    </div>
  )
}

export default Search;
