import React from "react";
import Waveform from "./Waveform";
import Dropdown from 'react-dropdown';
import keyIndex from 'react-key-index';
import shortid from 'shortid';
import 'react-dropdown/style.css';

const data = [];

const style = {
  mainDropdown: {
    padding: '10px'
  },
  controls: {
    padding: '10px'
  },
  waveForm: {
  }
}

class WaveformContainer extends React.Component {
  constructor() {
    super();

    this.togglePlay = this.togglePlay.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.resetPlayhead = this.resetPlayhead.bind(this);
    this.getFilenames = this.getFilenames.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.createWaveform = this.createWaveform.bind(this);
    this.updateSelectedFile = this.updateSelectedFile.bind(this);

    this.state = {
      isPlaying: false,
      isAtBeginning: true,
      progress: 0.0,
      audioFiles: [],
      selectedFile: null,
      options: []
    };
  }

  togglePlay() {
    this.setState({ 
      isPlaying: !this.state.isPlaying,
      isAtBeginning: false 
    });
  }

  updateProgress(progress) {
    this.setState({ progress, isAtBeginning: false })
  }

  resetPlayhead() {
    this.setState({ isAtBeginning: true })
  }

  fileUpload(event) {
    const files = event.target.files

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const file = files[i];

      reader.addEventListener("load", () => {
        if (data.find(el => el.name === file.name)) {
          console.log('already uploaded')
          return
        }

        data.push({id: shortid.generate(), name: file.name, url: reader.result})
        const options = data.map(el => {
          let newObj = {};
          newObj['value'] = el.id;
          newObj['label'] = el.name;
          return newObj;
        })
        this.setState({ options })
        // let newAudioFiles = Array.from(data) // make a copy of data, not a ref to it
        // this.setState({ audioFiles: newAudioFiles })
      }, false);
  
      if (file) {
        reader.readAsDataURL(file);
      }
    }
    event.target.value = null;
  }

  getFilenames() {
    return this.state.audioFiles.map(file => file.name)
  }

  handleMenuChange(e, idx) {
    const newFile = data.find(el => el.id === e.value);
    const newAudioFiles = this.state.audioFiles;
    newAudioFiles[idx] = newFile;
    this.setState({ audioFiles: newAudioFiles})
  }

  removeFile(idx) {
    const newAudioFiles = Array.from(this.state.audioFiles);
    newAudioFiles.splice(idx, 1)
    this.setState({ audioFiles: newAudioFiles})
  }

  createWaveform() {
    if (data.length === 0) {
      return
    }
    const id = this.state.selectedFile ? this.state.selectedFile : this.state.options[0].value
    const waveform = data.filter(el => el.id === id )
    this.setState({ audioFiles: [...this.state.audioFiles, waveform[0]]})
  }

  updateSelectedFile(e) {
    this.setState({ selectedFile: e.value})
  }

  render() {

    return (
      <div>
        <div style={style.mainDropdown}>
          <Dropdown options={this.state.options} onChange={(e) => this.updateSelectedFile(e)} value={this.state.options[0]} placeholder={'select a file'} />
          <input type="file" multiple="multiple" onChange={this.fileUpload} disabled={this.state.isPlaying}></input>
          <button onClick={this.createWaveform} disabled={this.state.isPlaying}>create waveform </button>
          <p>
            <button onClick={this.togglePlay} disabled={this.state.audioFiles.length === 0}>
              <i className={this.state.isPlaying ? "fas fa-pause-circle" : "fas fa-play-circle"}></i>
            </button>
            <button onClick={this.resetPlayhead} disabled={this.state.audioFiles.length === 0}>
              <i class="fas fa-backward"></i>
            </button>
          </p>
        </div>
      
        <div style={style.waveForm}>
          {this.state.audioFiles.map((file, i) => {
            return (
              <Waveform
                key={i}
                idx={i}
                src={file.url}
                name={file.name}
                options={this.state.options}
                handleMenuChange={this.handleMenuChange} 
                isPlaying={this.state.isPlaying}
                progress={this.state.progress}
                updateProgress={this.updateProgress}
                isAtBeginning={this.state.isAtBeginning} 
                removeFile={this.removeFile}
              />
            )}
          )}
        </div>
      </div>
    );
  }
}

export default WaveformContainer;
