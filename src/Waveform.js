// components/waveform.js
import React from "react";
import ReactDOM from "react-dom";
import WaveSurfer from "wavesurfer";
import Dropdown from 'react-dropdown';


export default class Waveform extends React.Component {
  constructor(props) {
    super(props);

    this.waveform = React.createRef();
    this.play = this.play.bind(this);
    this.resetPlayhead = this.resetPlayhead.bind(this);
    // this.handleMenuChange = this.handleMenuChange.bind(this);


    this.state = {
      wavesurfer: null,
      isPlaying: false
    };
  }

  componentDidMount() {
    const wavesurfer = WaveSurfer.create({
      container: this.waveform.current,
      waveColor: "violet",
      progressColor: "purple"
    });
    this.setState({ wavesurfer });
    wavesurfer.load(this.props.src);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isPlaying !== this.props.isPlaying) {
      this.play();
    }
    if (newProps.isAtBeginning === true && newProps.isAtBeginning !== this.props.isAtBeginning) {
      this.resetPlayhead();
    }
    if (newProps.src !== this.props.src) {
      this.state.wavesurfer.load(newProps.src)
    }
  }

  play() {
    this.state.wavesurfer.playPause();
  }

  resetPlayhead() {
    this.state.wavesurfer.seekTo(0);
  }

  // handleMenuChange(e) {
  //   console.log(e.value)
  //   console.log(this.props)
  // }

  render() {
    return (
      <div>
        <div ref={this.waveform} />
        <span>{this.props.name}</span>
        <Dropdown options={this.props.names} onChange={(e) => this.props.handleMenuChange(e, this.props.id)} value={this.props.name} placeholder="Select an option" />
      </div>
    );
  }
}

Waveform.defaultProps = {
  src: ""
};
