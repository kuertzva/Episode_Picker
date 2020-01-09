import React from 'react';
import MainButton from './mainButton.js';
import './static/topBar.scss';

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
          <MainButton
            id='open-nav-button'
            action={props.flip}
            title='Nav Bar'
            link={false}
            inline={true}
          />
          <h1> Episode Picker </h1>
          <MainButton
            id='github-button'
            action='https://github.com/kuertzva/Episode_Picker'
            title='Github'
            link={true}
            inline={true}
          />
        </div>
      </div>
    )
  }

  return display;
}

// export default TopBar;
