import React from 'react';
import { render } from 'react-dom';
import WaveformContainer from './WaveformContainer';
import './main.css';

const App = () => (
  <WaveformContainer />  
);

render(<App />, document.getElementById('root'));
