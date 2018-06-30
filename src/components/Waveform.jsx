import React from "react";
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import WaveSurfer from "wavesurfer.js";
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Dropdown from 'react-dropdown';


class Waveform extends React.Component {
  constructor() {
    super();

    this.wavesurfer = null; // do i need this?

    // ref for wavesurfer container element
    this.waveform = React.createRef();

    // bind functions
    this.createRegion = this.createRegion.bind(this);
    this.resetPlayhead = this.resetPlayhead.bind(this);
    this.setInitialPlayhead = this.setInitialPlayhead.bind(this);
    this.getProgress = this.getProgress.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
  
    this.state = {
      volume: 0.5,
    };
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
    this.wavesurfer.on('seek', this.updateProgress)
    this.wavesurfer.on('pause', this.getProgress)
    this.wavesurfer.on('ready', this.setInitialPlayhead)
    this.wavesurfer.on('finish', () => this.props.setPlaying(false))


    // Hack to make wavesurfer resize
    const responsiveWave = this.wavesurfer.util.debounce(() => {
      wavesurfer.drawer.setWidth(0);
      wavesurfer.drawer.drawPeaks({
        length: wavesurfer.drawer.getWidth()
      }, 0);
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

  createRegion() {
    const duration = this.wavesurfer.getDuration() 

    const endTime = duration < 4 ? Math.floor(duration * .5) : 2
    this.region = this.wavesurfer.addRegion(
      { id: '1', 
        start: 0, 
        end: endTime, 
        color: 'rgba(233, 233, 0, 0.3)' 
      }
    )
    this.region.on('in', () => this.region.playLoop());
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
    this.updateProgress(progress)
  }

  setVolume(e) {
    this.setState({volume: e.target.value})
    this.wavesurfer.setVolume(e.target.value)
  }

  removeFile() {
    const idx = this.props.idx;
    this.region.remove(); // why is region on the instance? Plus, it's not declared until later.
    this.props.setPlaying(false);
    const newAudioFiles = Array.from(this.props.audioFiles); // it's already an array?
    newAudioFiles.splice(idx, 1);
    this.props.editAudioFiles(newAudioFiles);
  }

  updateProgress(progress) {
    this.props.setProgress(progress);
    this.props.setBeginning(false);
  }

  handleMenuChange(e, idx) {
    const newFile = this.props.data.find(el => el.id === e.value);
    const newAudioFiles = this.props.audioFiles;
    newAudioFiles[idx] = newFile;
    this.props.editAudioFiles(newAudioFiles);
  }

  render() {
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
                    onChange={(e) => this.handleMenuChange(e, idx)} 
                    value={this.props.name} 
                    placeholder="Select an option"/>
          <button onClick={ this.removeFile }>remove</button>
        </div>
        
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    audioFiles: state.app.audioFiles,
    cycle: state.app.cycle,
    isAtBeginning: state.app.isAtBeginning,
    isPlaying: state.app.isPlaying,
    options: state.app.options,
    progress: state.app.progress
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editAudioFiles: (files) => {
      dispatch(actions.editAudioFiles(files));
    },
    setBeginning: (bool) => {
      dispatch(actions.setBeginning(bool));
    },
    setPlaying: (bool) => {
      dispatch(actions.setPlaying(bool));
    },
    setProgress: (progress) => {
      dispatch(actions.setProgress(progress));
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Waveform);
