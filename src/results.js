import React from 'react';
import LoadScreen from './loadScreen.js';
import './static/results.scss';
import $ from 'jquery';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.runSearch = this.runSearch.bind(this);
    this.newSearch = this.newSearch.bind(this);
  }

  runSearch() {
    console.log('runSearch()')
    var attempts = 0;
    var success = false;
    var output;
    this.props.loadToggle();

    $.get('/search_batch', (data, status) => {
      //
      this.props.handleUpdate(data);
      console.log('received')
    });
  }

  newSearch() {
    console.log('search terms initiated');
    $.get('/q=' + this.props.query, (data, status) => {



      if (data) {
        this.runSearch(data);
      } else {
        alert("Error: failed to update search parameters on server");
      }
    });
  }

  componentDidMount() {
    this.newSearch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.newSearch();
    }
  }

  render() {
    var results;
    var loading;
    console.log(this.props.length);

    function formatResult(result) {
      return (
        <div
          data-id={result.id}
          data-title={result.title}
          data-image={result.image}
          key={result.id}
          onClick={(e) => this.props.onClick(e)}
          className="result"
        >
          <h3> {result.title} </h3>
          <img src={result.image}/>
        </div>
      )
    }
    formatResult = formatResult.bind(this);

    if (!this.props.loading && this.props.results.length === 0) {
      results = (
        <div id="no-results">
          <h3> Umm... Hey... </h3>
          <br/>
          <p>
            {"Your search for '" + this.props.query +
            "' hasn't turned up any results."}
          </p>
          <br/>
          <p>
            {"This could be due to IMDB not having a matching show or it could be a bug in my code. Please feel encouraged to contact me at kuertzva@miamioh.edu"}
          </p>
        </div>
      );
    } else {
      console.log(this.props.results);
      console.log(Array.isArray(this.props.results));
      var shows;
      var buffer;
      var footer;

      // create space so search screen doesn't crowd header
      if (this.props.results.length < 1) {
        buffer = <div className='load-buffer'></div>
        shows = null;
      } else {
        buffer = null
        shows = this.props.results.map((show) => formatResult(show));
      }

      // determine whether to display button, loading screen or nothing
      if (this.props.loading) {
        footer =(
          <div className='load-results'>
            <LoadScreen string='Searching'/>
          </div>
        );
      } else if (this.props.more) {
        footer = (
          <button
            id="more"
            className='future-border'
            onClick={this.runSearch}
          >
            More Shows
          </button>
        );
      } else {
        footer = null;
      }

      // output
      results = (
        <div id="results">
          {shows}
          {buffer}
          {footer}
        </div>
      )
    }


    return (
      <div id="results-page">
        <h2> {"Search for '" +this.props.query + "':"} </h2>
        {results}
      </div>
    );
  }
}


export default Results;
