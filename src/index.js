import React from 'react';
import { render } from 'react-dom';
import WaveSurfer from 'wavesurfer';
import WaveformContainer from './WaveformContainer';



const App = () => (
  <div>
    <WaveformContainer />
   
  </div>
);

render(<App />, document.getElementById('root'));
