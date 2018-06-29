import React from "react";
import { connect } from 'react-redux';
import Header from "./Header";
import FileUploads from './FileUploads';
import Controls from "./Controls";
import Waveform from "./Waveform";

class WaveMixer extends React.Component {
  constructor() {
    super();

    // file store
    this.data = [];
  }

  render() {
    return (
      <div>
        <Header />
        <FileUploads data={ this.data } />
        <Controls data={ this.data } />

        { 
          this.props.audioFiles.map((file, i) => {
            return (
              <Waveform
                key={i}
                idx={i}
                disabled={ false }
                data={ this.data }
                src={ file.url }
                name={ file.name } />
            )
          })
        }

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    audioFiles: state.app.audioFiles
  }
}

export default connect(
  mapStateToProps
)(WaveMixer);
