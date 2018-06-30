import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import PlaybackButton from './PlaybackButton';
import style from '../styles/controls.style';

const Controls = (props) => {
  return (
    <div style={style.main}>

      <div>
        <span>Controls:</span>

        <PlaybackButton 
          text="Play/Pause All"
          handleClick={ props.togglePlay }
          disabled={ props.audioFiles.length === 0 }
          css={ style.button }
          iconClass={ props.isPlaying ? "fas fa-pause-circle" : "fas fa-play-circle" } />
        
        <PlaybackButton 
          text="Back to Beginning"
          handleClick={ props.resetPlayhead }
          disabled={ props.audioFiles.length === 0 }
          css={ style.button }
          iconClass="fas fa-backward" />
        
        <PlaybackButton 
          text="Cycle On/Off"
          handleClick={ props.setCycle }
          disabled={ props.audioFiles.length === 0 }
          css={ style.button }
          iconClass="fas fa-undo" />

      </div>

    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    audioFiles: state.app.audioFiles,
    isPlaying: state.app.isPlaying
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetPlayhead: () => {
      dispatch(actions.setBeginning(true));
    },
    setCycle: () => {
      dispatch(actions.toggleCycle());
    },
    togglePlay: () => {
      dispatch(actions.togglePlaying());
      dispatch(actions.setBeginning(false));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls);
