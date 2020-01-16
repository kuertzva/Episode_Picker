import React from 'react';
import SuggestedShow from './suggestedShow.js'
import './static/suggestions.scss';
import $ from 'jquery';

class Suggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      shows: null
    }
  }

  componentDidMount() {

    if(this.props.user) {
      $.post('/past_runs', {"runs": this.props.user},
      (data) => {
        this.setState({
          shows: data
        });
      });
    } else {
      $.get('/past_searches',
      (data) => {
        this.setState({
          shows: data
        });
      });
    }
  }


  render() {
    var title;
    if (this.props.user) {
      title = 'Past Searches'
    } else {
      title = 'Popular Searches'
    }

    if (this.state.shows === null || this.state.length === 0) {
      return null;
    } else {
      var content = this.state.shows.map(show => (
        <SuggestedShow
          show={show}
          onClick={this.props.setShow}
          key={show.link}
        />
      ));
      return (
        <div className='suggestion-box future-border'>
          <p>{title}:</p>
          <div className='showcase'>
            {content}
          </div>
        </div>
      );
    }



  }
}

export default Suggestions;
