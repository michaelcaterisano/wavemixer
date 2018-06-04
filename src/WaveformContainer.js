import React from "react";
import Header from "./components/Header";
import Controls from "./components/Controls";
import Waveform from "./Waveform";
import shortid from 'shortid';

// you need to get rid of this...
const data = [];

const style = {
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
    this.setFinished = this.setFinished.bind(this);
    this.setCycle = this.setCycle.bind(this);

    this.state = {
      isPlaying: false,
      isAtBeginning: true,
      progress: 0.0,
      audioFiles: [],
      selectedFileId: null,
      selectedFileName: null,
      options: [], 
      files: [],
      cycle: true
    };
  }

  togglePlay() {
    this.setState({ 
      isPlaying: !this.state.isPlaying,
      isAtBeginning: false
    });
  }

  setFinished() {
    this.setState({ isPlaying: false })
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

      if (!this.state.files.includes(file)){
        this.setState({ files: [...this.state.files, file]})
      }

      reader.addEventListener("load", () => {
        if (data.find(el => el.name === file.name)) {
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
    this.setState({isPlaying: false})
    const newAudioFiles = Array.from(this.state.audioFiles);
    newAudioFiles.splice(idx, 1)
    this.setState({ audioFiles: newAudioFiles })
  }

  createWaveform() {
    if (data.length === 0) {
      return
    }
    const id = this.state.selectedFileId ? this.state.selectedFileId : this.state.options[0].value
    const waveform = data.filter(el => el.id === id )
    this.setState({ audioFiles: [...this.state.audioFiles, waveform[0]]})
  }

  updateSelectedFile(e) {
    this.setState({ selectedFileId: e.value, selectedFileName: e.label })
  }

  setCycle() {
    this.setState({ cycle: !this.state.cycle })
  }

  render() {

    return (
      <div>
        
        <Header />

        <Controls 
          data={data}
          state={this.state}
          fileUpload={this.fileUpload}
          updateSelectedFile={this.updateSelectedFile}
          createWaveform={this.createWaveform}
          togglePlay={this.togglePlay}
          resetPlayhead={this.resetPlayhead}
          setCycle={this.setCycle} />

          {this.state.audioFiles.map((file, i) => {
            return (
              <Waveform
                disabled={false}
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
                setFinished={this.setFinished}
                resetPlayhead={this.resetPlayhead}
                cycle={this.state.cycle}
              />
            )}
          )}
      </div>
    );
  }
}

export default WaveformContainer;
