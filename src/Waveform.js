import React from "react";
// import ReactDOM from "react-dom";
import WaveSurfer from "wavesurfer.js";
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Dropdown from 'react-dropdown';


export default class Waveform extends React.Component {
  constructor() {
    super();

    this.wavesurfer; // do i need this?

    // ref for wavesurfer container element
    this.waveform = React.createRef();

    // bound functions
    this.resetPlayhead = this.resetPlayhead.bind(this);
    this.setInitialPlayhead = this.setInitialPlayhead.bind(this);
    this.getProgress = this.getProgress.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.createRegion = this.createRegion.bind(this);
  
    this.state = {
      volume: 0.5,
    };
  }

  createRegion() {
    const duration = this.wavesurfer.getDuration()
    this.region = this.wavesurfer.addRegion(
      { id: '1', 
        start: 0, 
        end: Math.floor(duration * .25), 
        color: 'rgba(233, 233, 0, 0.3)' 
      }
    )
    this.region.on('in', () => this.region.playLoop());
  }

  componentDidMount() {
    const wavesurfer = WaveSurfer.create({
      container: this.waveform.current,
      waveColor: "violet",
      progressColor: "purple",
      height: 50,
      responsive: 2.0,
      plugins: [
        RegionPlugin.create()
      ]
    });

    this.wavesurfer = wavesurfer;

    this.wavesurfer.load(this.props.src);
    this.wavesurfer.on('seek', this.props.updateProgress)
    this.wavesurfer.on('pause', this.getProgress)
    this.wavesurfer.on('ready', this.setInitialPlayhead)
    this.wavesurfer.on('finish', this.props.setFinished)


    // Hack to make wavesurfer resize
    const responsiveWave = this.wavesurfer.util.debounce(() => {
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
    if (newProps.cycle === true && newProps.cycle !== this.props.cycle) {
      this.createRegion();      
    }
    if (newProps.cycle === false) {
      this.region.remove();
    }
  }

  componentWillUnmount() {
    this.wavesurfer.destroy();
  }

  resetPlayhead() {
    this.wavesurfer.seekTo(0);
  }

  setInitialPlayhead() {
    this.createRegion();

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
    this.region.remove()
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

// Waveform.defaultProps = {
//   src: ""
// };
