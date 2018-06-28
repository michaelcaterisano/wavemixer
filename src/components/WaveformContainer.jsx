import React from "react";
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import Header from "./Header";
import Controls from "./Controls";
import Waveform from "./Waveform";

class WaveformContainer extends React.Component {
  constructor() {
    super();

    // file store
    this.data = [];

    this.resetPlayhead = this.resetPlayhead.bind(this);
    this.getFilenames = this.getFilenames.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.setFinished = this.setFinished.bind(this);

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

  setFinished() {
    this.setState({ isPlaying: false })
  }

  updateProgress(progress) {
    this.setState({ progress, isAtBeginning: false })
  }

  resetPlayhead() {
    this.setState({ isAtBeginning: true })
  }

  getFilenames() {
    return this.state.audioFiles.map(file => file.name)
  }

  handleMenuChange(e, idx) {
    const newFile = this.data.find(el => el.id === e.value);
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

  getWaveforms() {
    this.state.audioFiles.map((file, i) => {
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
          cycle={this.state.cycle} />
      )
    })
  }

  render() {
    return (
      <div>
        
        <Header />

        <Controls data={this.data} />

        { this.getWaveforms() }

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WaveformContainer);
