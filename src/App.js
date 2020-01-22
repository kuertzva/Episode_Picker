import React from 'react';
import { TopBar } from './topBar.js';
import './static/App.scss';
import Search from './search.js'
import Start from './start.js';
import Results from './results.js';
import Details from './details.js';
import Episode from './episode.js';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.navToggle = this.navToggle.bind(this);
    this.loadToggle = this.loadToggle.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.setShow = this.setShow.bind(this);
    this.initSeasons = this.initSeasons.bind(this);
    this.toggleSeason = this.toggleSeason.bind(this);
    this.updateRating = this.updateRating.bind(this);
    this.changeEpisode = this.changeEpisode.bind(this);
    this.clearEpisode = this.clearEpisode.bind(this);
    this.suggestionJump = this.suggestionJump.bind(this);
    this.toggleJumpSeasons = this.toggleJumpSeasons.bind(this);


    this.state = {
      nav: false,
      loading: false,
      search_input: '',
      query: '',
      queried: false,
      results: [],
      more_button: true,
      show: null,
      seasons: [],
      jumpSeasons: false,
      ratingFactor: 1,
      episode: null
    }
  }

  navToggle() {
    this.setState((state) => ({
      nav: !(state.nav)
    }));

  }

  loadToggle() {
    alert(this.state.loading);
    this.setState((state) => ({
      loading: !(state.loading)
    }));
  }


  // start page functions
  handleQuery(e) {
    const value = e.target.value;

    //scrub as needed later

    this.setState({
      search_input: value
    })

    //console.log(this.state.query);

  }

  handleSearch() {
    console.log("handleSearch")
    if (this.state.search_input.length > 0
        && this.state.search_input !== this.state.query) {
      console.log("extra length");
      this.setState((state) => ({
        queried : true,
        query: state.search_input,
        results: [],
        show: null,
        seasons: [],
        ratingFactor: 1,
        episode: null
      }));
    }
  }

  //search page functions
  updateSearch(data) {

    console.log('updateSearch');

    const batch = data[0];

    console.log(batch.length);

    this.setState({
      results: this.state.results.concat(batch),
      more_button: data[1]
    });

    this.loadToggle();
  }

  setShow(e) {
    const element = e.currentTarget;
    const showTitle = element.getAttribute('data-title');
    const showId = element.getAttribute('data-id');
    const showImage = element.getAttribute('data-image');

    this.setState({
      show: {
        title: showTitle,
        id: showId,
        image: showImage
      }
    });

  if (this.state.loading) {
      this.loadToggle();
  }
  }

  //details page functions
  initSeasons(seasons, activeSeasons = null) {
    //format seasons
    var formattedSeasons;

    if (activeSeasons){

      formattedSeasons = seasons.map((season) => {
        return {
          number: season,
          active: false
        }
      })

      var season;
      for (season of activeSeasons) {
        formattedSeasons[season - 1].active = true;
      }

    } else {
      formattedSeasons = seasons.map((season) => {
        return {
          number: season,
          active: true
        }
      })
    }




    this.setState({
      seasons: formattedSeasons
    })

    if(this.state.loading) {
      this.loadToggle();
    }

    console.log('updateSeasons()');
  }

  toggleSeason(seasonIndex) {
    var newSeasons = this.state.seasons;
    console.log(newSeasons);


    newSeasons[seasonIndex].active = !newSeasons[seasonIndex].active;

    this.setState({
      seasons: newSeasons
    })
  }

  toggleJumpSeasons() {
    /* This is the flag that tells details whether or not it needs
    to get the seasons from the server */

    this.setState((state) => ({
      jumpSeasons: !state.jumpSeasons
    }));
  }

  updateRating(e) {
    this.setState({
      ratingFactor: e.target.value
    })
  }

  changeEpisode(data) {
    this.setState({
      episode: data
    })
  }

  clearEpisode() {
    this.setState({
      episode: null
    })
  }

  suggestionJump(e) {
    console.log("suggestionJump()")
    this.setShow(e)

    const element = e.currentTarget;
    var showSeasons = element.getAttribute('data-seasons');
    var activeSeasons = element.getAttribute('data-active');
    const ratingFactor = element.getAttribute('data-ratingFactor');

    if (showSeasons && ratingFactor) {
      this.toggleJumpSeasons()
      showSeasons = showSeasons.split(',');
      activeSeasons = activeSeasons.split(',');
      showSeasons = showSeasons.map(season => parseInt(season));
      activeSeasons = activeSeasons.map(season => parseInt(season));

      console.log("showSeasons: " + showSeasons);
      console.log("activeSeasons: " + activeSeasons);
      this.initSeasons(showSeasons, activeSeasons);

      this.setState({
        ratingFactor: parseFloat(ratingFactor)
      })
    }

  }

  // Overlay will allow for pop ups. null for now
  render() {
    var overlay = null;

    var content;

    if (this.state.episode) {
      content = (
        <Episode
          episode={this.state.episode}
          seasons={this.state.seasons}
          rating={this.state.ratingFactor}
          changeParams={this.clearEpisode}
          changeEpisode={this.changeEpisode}
          loading={this.state.loading}
        />
      );
    } else if (this.state.show) {
      content = (
        <Details
          show={this.state.show}
          seasons={this.state.seasons}
          rating={this.state.ratingFactor}
          loading={this.state.loading}
          jumpSeasons={this.state.jumpSeasons}
          loadToggle={this.state.loadToggle}
          initSeasons={this.initSeasons}
          toggleSeason={this.toggleSeason}
          toggleJumpSeasons={this.toggleJumpSeasons}
          updateRating={this.updateRating}
          changeEpisode={this.changeEpisode}
        />
      );
    } else if (this.state.queried) {
      console.log(this.state.show);
      content = (
        <Results
          query={this.state.query}
          loading={this.state.loading}
          loadToggle={this.loadToggle}
          results={this.state.results}
          more={this.state.more_button}
          handleUpdate={this.updateSearch}
          onClick={this.setShow}
        />
      );
    } else {
      content = (
        <Start
          setShow={this.suggestionJump}
        />
      );
    }

    return (
      <div id='frame' className='col-12 row-12'>
        {overlay}
        <TopBar
          nav={this.state.nav}
          flip={this.navToggle}
        />
        <div id="content" className='future-border'>
          <Search
            search_input={this.state.search_input}
            handleChange={this.handleQuery}
            handleSubmit={this.handleSearch}
          />
          <br/>
          {content}
        </div>
      </div>
    );
  }
}

export default App;
