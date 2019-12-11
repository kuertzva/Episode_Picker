import React from 'react';
import { TopBar } from './topBar.js';
import './static/App.scss';
import Start from './start.js';
import Search from './search.js';
import Details from './details.js';
import Episode from './episode.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.navToggle = this.navToggle.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.state = {
      nav: false,
      query: '',
      queried: false,
      show: null,
      seasons: [],
      ratingFactor: null,
      episode: null
    }
  }

  navToggle() {
    this.setState((state) => ({
      nav: !(state.nav)
    }));
  }

  // start page functions
  handleQuery(e) {
    const value = e.target.value;

    //scrub as needed later

    this.setState({
      query: value
    })

  }

  handleSearch() {
    this.setState({
      queried : true
    })

  }

  // Overlay will allow for pop ups. null for now
  render() {
    var overlay = null;

    var content;

    if (this.state.queried) {
      if (this.state.seasons.length > 0) {
        if (this.state.episode) {
          content = (
            <Episode/>
          )
        } else {
          content = (
            <Details/>
          )
        }
      } else {
        content = (
          <Search
            results={null}
            page={1}
          />
        )
      }
    } else {
      content = (
        <Start
          query={this.state.query}
          handleChange={this.handleQuery}
          handleSubmit={this.heandleSearch}
        />
      )
    }

    return (
      <div id='frame' className='col-12 row-12'>
        {overlay}
        <TopBar
          nav={this.state.nav}
          flip={this.navToggle}
        />
        <div id="content" className='future-border'>
          {content}
        </div>
      </div>
    );
  }
}

export default App;
