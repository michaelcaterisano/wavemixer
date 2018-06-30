import React from "react";
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import Dropdown from 'react-dropdown';
import shortid from 'shortid';
import 'react-dropdown/style.css';
import style from '../styles/controls.style';

const FileUploads = (props) => {

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
          
        <button onClick={ createWaveform } disabled={props.isPlaying || props.data.length === 0}>
          Create Waveform
        </button>

      </div>

    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    files: state.app.files,
    isPlaying: state.app.isPlaying,
    options: state.app.options,
    selectedFileId: state.app.selectedFileId,
    selectedFileName: state.app.selectedFileName
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAudioFile: (file) => {
      dispatch(actions.addAudioFile(file));
    },
    addFile: (file) => {
      dispatch(actions.addFile(file));
    },
    setOptions: (options) => {
      dispatch(actions.setOptions(options));
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
)(FileUploads);
