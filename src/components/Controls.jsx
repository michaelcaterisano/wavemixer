import React from 'react';
import Dropdown from 'react-dropdown';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import shortid from 'shortid';
import 'react-dropdown/style.css';

const Controls = (props) => {
  const style = {
    main: {
      padding: '10px'
    },
    dropdown: {
      display: 'flex'
    },
    button: {
      padding: '5px'
    }
  };

  const fileUpload = (event) => {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const file = files[i];

      if (!props.files.includes(file)){
        props.addFile(file);
      }

      reader.addEventListener("load", () => {
        if (props.data.find(el => el.name === file.name)) {
          return
        }

        props.data.push({id: shortid.generate(), name: file.name, url: reader.result});

        const options = props.data.map(el => {
          props.setSelectedFile( el.id, el.name );

          let newObj = {};
          newObj['value'] = el.id;
          newObj['label'] = el.name;
          return newObj;
        })
        
        props.setOptions( options );
      }, false);
  
      if (file) {
        reader.readAsDataURL(file);
      }
    }
    //event.target.value = null;
  };

  const createWaveform = () => {
    if (props.data.length === 0) {
      return
    }
    const id = props.selectedFileId ? props.selectedFileId : props.options[0].value;
    const waveform = props.data.filter(el => el.id === id );
    props.addAudioFile(waveform[0]);
  };

  return (
    <div style={style.main}>

      <div>
        <input type="file" multiple="multiple" onChange={ (e) => fileUpload(e) } disabled={props.isPlaying} />
      </div>

      <div style={style.dropdown}>
        <Dropdown 
          options={ props.options } 
          onChange={ (e) => props.updateSelectedFile(e) } 
          value={ props.selectedFileName || props.options[0] } 
          placeholder='upload some files!' />
          
        <button onClick={createWaveform} disabled={props.isPlaying || props.data.length === 0}>
          create waveform
        </button>
      </div>

      <div>
        <span>Controls:</span>

        <button onClick={props.togglePlay} disabled={props.audioFiles.length === 0}>
          <i className={props.isPlaying ? "fas fa-pause-circle" : "fas fa-play-circle"} />
          <span style={style.button}>Play/pause all</span>
        </button>

        <button onClick={props.resetPlayhead} disabled={props.audioFiles.length === 0}>
          <i className="fas fa-backward" />
          <span style={style.button}>Back to beginning</span>
        </button>

        <button onClick={props.setCycle}>
          <i className="fas fa-undo" />
          <span style={style.button}>Cycle On/Off</span>
        </button>
      </div>

    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    audioFiles: state.app.audioFiles,
    files: state.app.files,
    isPlaying: state.app.isPlaying,
    options: state.app.options,
    selectedFileId: state.app.selectedFileId,
    selectedFileName: state.app.selectedFileName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetPlayhead: () => {
      dispatch(actions.setBegining(true));
    },
    addAudioFile: (file) => {
      dispatch(actions.addAudioFile(file));
    },
    addFile: (file) => {
      dispatch(actions.addFile(file));
    },
    setCycle: () => {
      dispatch(actions.toggleCycle());
    },
    setOptions: (options) => {
      dispatch(actions.setOptions(options));
    },
    togglePlay: () => {
      dispatch(actions.togglePlaying());
      dispatch(actions.setBegining(false));
    },
    setSelectedFile: (id, name) => {
      dispatch(actions.setFileId(id));
      dispatch(actions.setFileName(name));
    },
    updateSelectedFile: (e) => {
      dispatch(actions.setFileId(e.value));
      dispatch(actions.setFileName(e.label));
    } 
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls);