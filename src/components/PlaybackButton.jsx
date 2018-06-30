import React from 'react';

export default (props) => {
  return (
    <button onClick={ props.handleClick } disabled={ props.disabled }>
      <i className={ props.iconClass } />
      <span style={ props.css }>
        { props.text }
      </span>
    </button>
  );
}