import React from 'react';
import './topBar.css';

export function TopBar(props) {
  var display;

  if(props.nav) {
    display = (
      <div id='nav-bar' class='col-12'>
        <button
          id='nav-bar-close'
          class='close-button'
          onClick={props.flip}
        >
          X
        </button>
        <div id='inner-nav'>
          <a class='link-block' href='https://vkwebsite.herokuapp.com/'>Homepage</a>
          <a class='link-block' href='https://vkplaid.herokuapp.com/'>Plaid Maker</a>
          <a class='link-block' href='https://vkep-picker.herokuapp.com/ep_search' id='active'>Episode Picker</a>
          <p class='hidden link-block' id='placeholder'></p>
        </div>
      </div>
    )
  } else {
    display = (
      <div id='top-bar'>
        <div>
          <button
            id='nav-bar-open'
            className='future-border'
            onClick={props.flip}
          >Nav Bar</button>
          <h1> Episode Picker </h1>
          <a
            href='https://github.com/kuertzva/Episode_Picker'
            id='github-link'
            className='future-border buttonish'
          >Github</a>
        </div>
      </div>
    )
  }

  return display;
}

// export default TopBar;
