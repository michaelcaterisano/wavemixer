import React from "react";
// import ReactDOM from "react-dom";
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
    this.removeFile = this.removeFile.bind(this);
    this.setVolume = this.setVolume.bind(this);

    // this.wavesurfer = null
  
    this.state = {
      volume: 0.5
    };
  }

  componentDidMount() {
    const wavesurfer = WaveSurfer.create({
      container: this.waveform.current,
      waveColor: "violet",
      progressColor: "purple",
      height: 50,
      responsive: 2.0
    });

    this.wavesurfer = wavesurfer;

    this.wavesurfer.load(this.props.src);
    this.wavesurfer.on('seek', this.props.updateProgress)
    this.wavesurfer.on('pause', this.getProgress)
    this.wavesurfer.on('ready', this.setInitialPlayhead)
    this.wavesurfer.on('finish', this.props.setFinished)


    // Hack to make wavesurfer resize
    const responsiveWave = this.wavesurfer.util.debounce(() => {
      // wavesurfer.empty();
      wavesurfer.drawer.setWidth(0),
      wavesurfer.drawer.drawPeaks({
        length: wavesurfer.drawer.getWidth()
      }, 0)
      wavesurfer.drawBuffer();
    }, 150); 


    window.addEventListener('resize', () => {
      responsiveWave()
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.progress !== this.props.progress) {
      this.wavesurfer.seekTo(newProps.progress);
    }
    if (newProps.isPlaying === true) {
      this.wavesurfer.play();
    }
    if (newProps.isPlaying === false && newProps.isPlaying !== this.props.isPlaying) {
      this.wavesurfer.pause();
    } 
    if (newProps.isAtBeginning === true && newProps.isAtBeginning !== this.props.isAtBeginning) {
      this.resetPlayhead();
    }
    if (newProps.src !== this.props.src) {
      this.wavesurfer.load(newProps.src)
    }
  }

  componentWillUnmount() {
    this.wavesurfer.destroy();
  }

  resetPlayhead() {
    this.wavesurfer.seekTo(0);
  }

  setInitialPlayhead() {
    if (this.props.progress !== 0) {
      this.wavesurfer.seekTo(this.props.progress)
    }
  }

  getProgress() {
    const current = this.wavesurfer.getCurrentTime();
    const duration = this.wavesurfer.getDuration();
    const progress = current/duration
    this.props.updateProgress(progress)
  }

  removeFile() {
    this.props.removeFile(this.props.idx);
  }

  setVolume(e) {
    this.setState({volume: e.target.value})
    this.wavesurfer.setVolume(e.target.value)
  }

  render() {
    const options = [...this.props.options, ]
    let idx = this.props.idx;
    return (
      <div>
        <div ref={this.waveform} />

        <div>
          <input type="range" min="0" max="1" step="0.01" value={this.state.volume} onChange={this.setVolume}/>
        </div>

        <div style={{display: 'flex'}}>
          <Dropdown disabled={this.props.isPlaying} 
                    options={this.props.options} 
                    onChange={(e) => this.props.handleMenuChange(e, idx)} 
                    value={this.props.name} 
                    placeholder="Select an option"/>
          <button onClick={() => this.removeFile() }>remove</button>
        </div>
        
      </div>
    );
  }
}

Waveform.defaultProps = {
  src: ""
};
