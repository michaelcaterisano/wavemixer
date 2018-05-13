import React from "react";
import Waveform from "./Waveform";


class WaveformContainer extends React.Component {
  constructor() {
    super();

    this.togglePlay = this.togglePlay.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.resetPlayhead = this.resetPlayhead.bind(this);

    this.state = {
      isPlaying: false,
      isAtBeginning: true,
      urls: ['https://s3.us-east-2.amazonaws.com/cutletmedia/fill2.mp3'],
    };
  }

  togglePlay() {
    this.setState({ 
      isPlaying: !this.state.isPlaying,
      isAtBeginning: false });
  }

  resetPlayhead() {
    this.setState({ isAtBeginning: true })
    console.log(this.state.isAtBeginning)
  }

  fileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", ()=> {
      this.setState(prevState => ({
        urls: [...prevState.urls, reader.result]}))
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }

  }



  render() {

    const waveforms = [];
    this.state.urls.map(url => {
      waveforms.push(<Waveform 
                        src={url} 
                        isPlaying={this.state.isPlaying}
                        isAtBeginning={this.state.isAtBeginning} />)
    })

    return (
      <div>
      {waveforms}
        <button onClick={this.togglePlay}>play/pause</button>
        <button onClick={this.resetPlayhead}>reset playhead</button>
        <input type="file" onChange={this.fileUpload}></input>
      </div>
    );
  }
}

export default WaveformContainer;
