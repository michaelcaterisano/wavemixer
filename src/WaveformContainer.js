import React from "react";
import Waveform from "./Waveform";
import keyIndex from 'react-key-index';
import 'react-dropdown/style.css';

const data = [] 

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

  componentWillMount() {
    this.setState({ audioFiles: keyIndex(data, 1) })
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
      const file = files[i];
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        data.push({name: file.name, url: reader.result})
        this.setState({ audioFiles: keyIndex(data, 1)})
      }, false);
  
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  getFilenames() {
    return this.state.audioFiles.map(file => file.name)
  }

  handleMenuChange(e, childId) { 
    const newName = e.value;
    const newUrl = data.find(el => el.name === newName).url;
    const newAudioFiles = this.state.audioFiles.map(el => el._urlId === childId ? Object.assign({}, el, {name: newName, url: newUrl}) : el )
    this.setState({ audioFiles: keyIndex(newAudioFiles, 1) })
  }


  render() {

    return (
      <div>
      {this.state.audioFiles.map((file, i) => {
        return (
          <div>
            <Waveform
              key={file._urlId} 
              id={file._urlId}
              src={file.url}
              name={file.name}
              names={data.map(el => el.name)}
              handleMenuChange={this.handleMenuChange} 
              isPlaying={this.state.isPlaying}
              progress={this.state.progress}
              updateProgress={this.updateProgress}
              isAtBeginning={this.state.isAtBeginning} 
            />
          </div>
        )
      })}
        <button onClick={this.togglePlay}>play/pause</button>
        <button onClick={this.resetPlayhead}>reset playhead</button>
        <input type="file" multiple="multiple" onChange={this.fileUpload}></input>
      </div>
    );
  }
}

export default WaveformContainer;
