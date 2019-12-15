import React from 'react';
import LoadScreen from './loadScreen.js';
import './static/search.scss';
import $ from 'jquery';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.run_search = this.run_search.bind(this);
  }

  run_search() {
    var attempts = 0;
    var success = false;
    var output;

    $.get('/search_batch', (data, status) => {
      //
      this.props.handleUpdate(data);
      console.log('received')
    });

    /*
    while (!success || attempts < 4) {
      $.get('/q=' + this.props.query, function(data, status) {
        alert(data, status);
        //
      });

      attempts += 5;
    }
    */



  }

  componentDidMount() {
    $.get('/q=' + this.props.query, (data, status) => {

      console.log('componentDidMount');

      if (data) {
        this.run_search();
      } else {
        alert("Error: failed to update search parameters on server");
      }
    });
  }


/*  loadScreenUpdate() {


    var dots = this.state.dots;

    // determine number of dots
    if(dots < 3) {
      dots += 1;
    } else {
      dots = 1;
    }
    // update
    this.setState({
      dots: dots
    });
  } */

  render() {
    var results

    function formatResult(result) {
      console.log(result.link)
      return (
        <div
          data-link={result.link}
          key={result.link}
          onClick={alert('ya done clicked!')}
          className="result"
        >
          <h3> {result.title} </h3>
          <img src={result.image}/>
        </div>
      )
      return
    }

    formatResult = formatResult.bind(this);

    if (!this.props.results) {
      // create search place holder
      results =
      <div className='load-container'>
        <LoadScreen string='Searching'/>
      </div>
    } else if (this.props.results.length === 0){
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
      var shows = this.props.results.map((show) => formatResult(show));
      var result;
      for (result in results) {
        shows.push(formatResult(result));
      }
      results = (
        <div id="results">
          {shows}
        </div>
      )
    }


    return (
      <div id="search-page">
        <h2> {"Search for '" +this.props.query + "':"} </h2>

        {results}

      </div>
    )
  }
}

export default Search;
