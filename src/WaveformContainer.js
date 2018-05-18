import React from "react";
import Waveform from "./Waveform";
import keyIndex from 'react-key-index';
import shortid from 'shortid';
import 'react-dropdown/style.css';

const data = [];

class WaveformContainer extends React.Component {
  constructor() {
    super();

    this.togglePlay = this.togglePlay.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.resetPlayhead = this.resetPlayhead.bind(this);
    this.getFilenames = this.getFilenames.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.updateProgress = this.updateProgress.bind(this);

    this.state = {
      isPlaying: false,
      isAtBeginning: true,
      progress: 0.0,
      audioFiles: []
    };
  }

  // componentWillMount() {
  //   this.setState({ audioFiles: data })
  // }

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
        data.push({id: shortid.generate() ,name: file.name, url: reader.result})
        let newAudioFiles = Array.from(data) // make a copy of data, not a ref to it
        this.setState({ audioFiles: newAudioFiles })
      }, false);
  
      if (file) {
        reader.readAsDataURL(file);
      }
    }
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

  render() {
    const options = data.map(el => {
      let newObj = {};
      newObj['value'] = el.id;
      newObj['label'] = el.name;
      return newObj;
    })

    return (
      <div>
      {this.state.audioFiles.map((file, i) => {
        return (
          <Waveform
            key={i}
            idx={i}
            src={file.url}
            name={file.name}
            options={options}
            handleMenuChange={this.handleMenuChange} 
            isPlaying={this.state.isPlaying}
            progress={this.state.progress}
            updateProgress={this.updateProgress}
            isAtBeginning={this.state.isAtBeginning} 
          />
        )}
      )}
        <button onClick={this.togglePlay}>play/pause</button>
        <button onClick={this.resetPlayhead}>reset playhead</button>
        <input type="file" multiple="multiple" onChange={this.fileUpload}></input>
      </div>
    );
  }
}

export default WaveformContainer;
