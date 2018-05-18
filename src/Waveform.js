import React from "react";
import ReactDOM from "react-dom";
import WaveSurfer from "wavesurfer";
import Dropdown from 'react-dropdown';


export default class Waveform extends React.Component {
  constructor() {
    super();

    // ref for wavesurfer container element
    this.waveform = React.createRef();

    // bound functions
    this.resetPlayhead = this.resetPlayhead.bind(this);
    this.setInitialPlayhead = this.setInitialPlayhead.bind(this);
    this.getProgress = this.getProgress.bind(this);
  
    this.state = {
      wavesurfer: null
    };
  }

  componentDidMount() {

    const wavesurfer = WaveSurfer.create({
      container: this.waveform.current,
      waveColor: "violet",
      progressColor: "purple",
      height: 50
    });

    wavesurfer.load(this.props.src);
    wavesurfer.on('seek', this.props.updateProgress)
    wavesurfer.on('pause', this.getProgress)
    wavesurfer.on('ready', this.setInitialPlayhead)

    this.setState({ wavesurfer });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.progress !== this.props.progress) {
      this.state.wavesurfer.seekTo(newProps.progress);
    }
    if (newProps.isPlaying === true) {
      this.state.wavesurfer.play();
    }
    if (newProps.isPlaying === false) {
      this.state.wavesurfer.pause();
    } 
    if (newProps.isAtBeginning === true && newProps.isAtBeginning !== this.props.isAtBeginning) {
      this.resetPlayhead();
    }
    if (newProps.src !== this.props.src) {
      this.state.wavesurfer.load(newProps.src)
    }
  }

  resetPlayhead() {
    this.state.wavesurfer.seekTo(0);
  }

  setInitialPlayhead() {
    if (this.props.progress !== 0) {
      this.state.wavesurfer.seekTo(this.props.progress)
    }
  }

  getProgress() {
    const current = this.state.wavesurfer.getCurrentTime();
    const duration = this.state.wavesurfer.getDuration();
    const progress = current/duration
    this.props.updateProgress(progress)
  }

  render() {
    console.log(this.props)
    let idx = this.props.idx;
    return (
      <div>
        <div ref={this.waveform} />
        <Dropdown options={this.props.options} onChange={(e) => this.props.handleMenuChange(e, idx)} value={this.props.name} placeholder="Select an option" />
        <button onClick={(idx) => this.props.removeFile(idx)}>remove</button>
      </div>
    );
  }
}

Waveform.defaultProps = {
  src: ""
};
