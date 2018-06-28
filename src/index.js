import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import reducer from './reducers/reducer';
import WaveformContainer from './components/WaveformContainer';
import './main.css';

const store = createStore(reducer, devToolsEnhancer());

render(
  <Provider store={store}>
    <WaveformContainer />
  </Provider>, 
  document.getElementById('root')
);
