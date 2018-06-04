import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

/*
 *@prop fileUpload {function}
 *@prop state {isPlaying, options, selectedFileName, audioFiles}
 *@prop updateSelectedFile {function}
 *@prop createWaveform {function}
 *@prop togglePlay {function}
 *@prop resetPlayhead {function}
 *@prop setCycle {function}
 */
export default (props) => {
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

  return (
    <div style={style.main}>

      <div>
        <input type="file" multiple="multiple" onChange={props.fileUpload} disabled={props.state.isPlaying}>
        </input>
      </div>

      <div style={style.dropdown}>
        <Dropdown options={props.state.options} onChange={
          (e) => props.updateSelectedFile(e)} value={props.state.selectedFileName || props.state.options[0]} placeholder={'upload some files!'} />
        <button onClick={props.createWaveform} disabled={props.state.isPlaying || props.data.length === 0}>create waveform</button>
      </div>

      <div>
        <span>Controls:</span>

        <button onClick={props.togglePlay} disabled={props.state.audioFiles.length === 0}>
          <i className={props.state.isPlaying ? "fas fa-pause-circle" : "fas fa-play-circle"}></i>
          <span style={style.button}>Play/pause all</span>
        </button>

        <button onClick={props.resetPlayhead} disabled={props.state.audioFiles.length === 0}>
          <i className="fas fa-backward"></i>
          <span style={style.button}>Back to beginning</span>
        </button>

        <button onClick={props.setCycle}>
          <i className="fas fa-undo"></i>
          <span style={style.button}>Cycle On/Off</span>
        </button>
      </div>

    </div>
  )
}