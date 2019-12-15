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
    this.updateSearch = this.updateSearch.bind(this);

    this.state = {
      nav: false,
      query: '',
      queried: false,
      results: null,
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

    //console.log(this.state.query);

  }

  handleSearch() {
    if (this.state.query.length > 0) {
      this.setState({
        queried : true
      })
    }
  }

  //search page functions
  updateSearch(batch) {

    // check if first batch
    if (!this.state.results) {
      console.log(batch)
      this.setState({
        results: batch
      });
    } else {
      // add in new batch

      var newResults = this.state.results.concat(batch);
      console.log(newResults)
      this.setState({
        results: newResults
      });
    }
  }

  setShow(e) {
    const element = e.target;
    const show_link = element.getAttribute('data-link');

    this.setState({
      show: show_link
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
            query={this.state.query}
            results={this.state.results}
            handleUpdate={this.updateSearch}
            setShow={this.setShow}
          />
        )
      }
    } else {
      content = (
        <Start
          query={this.state.query}
          handleChange={this.handleQuery}
          handleSubmit={this.handleSearch}
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
