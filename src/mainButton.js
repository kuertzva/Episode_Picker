import React from 'react';
import $ from 'jquery';
import './static/mainButton.scss';

class MainButton extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    var button = document.getElementById(this.props.id);
    var style = getComputedStyle(button);
    button.parentNode.style.height = style.height;
    button.parentNode.style.width = style.width;
  }

  render() {
    var content;
    const wrapperStyle = {
      height: this.height,
      width: this.width
    }

    var classes = 'future-border';
    if (this.props.inline) {
      classes += ' inline'
    }

    if (this.props.link) {
      classes += ' buttonish';
      content = (
        <a
          className={classes}
          href={this.props.action}
          id={this.props.id}
        >
          {this.props.title}
        </a>
      );

    } else {
      content = (
        <button
          className={classes}
          onClick={this.props.action}
          id={this.props.id}
        >
          {this.props.title}
        </button>
      );
    }

    return (
      <div
        className='button-wrapper'
        style = {wrapperStyle}
      >
        {content}
      </div>
    )
  }
}

export default MainButton;
