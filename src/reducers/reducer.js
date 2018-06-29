import { combineReducers } from 'redux';
import * as init from './defaults';

function app(state = init.app, action) {
  switch(action.type) {

    case 'SET_FILE_ID':
      return Object.assign(
        {}, state, { selectedFileId: action.id }
      );

    case 'SET_FILE_NAME':
      return Object.assign(
        {}, state, { selectedFileName: action.name }
      );

    case 'TOGGLE_PLAYING':
      return Object.assign(
        {}, state, { isPlaying: !state.isPlaying }
      );

      case 'SET_PLAYING':
      return Object.assign(
        {}, state, { isPlaying: action.bool }
      );

    case 'SET_BEGINING':
      return Object.assign(
        {}, state, { isAtBeginning: action.bool }
      );

    case 'TOGGLE_CYCLE':
      return Object.assign(
        {}, state, { cycle: !state.cycle }
      );

    case 'ADD_AUDIO_FILE':
      const newAudioList = [...state.audioFiles, action.file];
      return Object.assign(
        {}, state, { audioFiles: newAudioList }
      );

    case 'EDIT_AUDIO_FILES':
      return Object.assign(
        {}, state, { audioFiles: action.files }
      );

      case 'ADD_FILE':
      const newFileList = [...state.files, action.file];
      return Object.assign(
        {}, state, { files: newFileList }
      );

    case 'SET_OPTIONS':
      return Object.assign(
        {}, state, { options: action.options }
      );

    case 'SET_PROGRESS':
      return Object.assign(
        {}, state, { progress: action.progress }
      );

    default:
      return state;
  }
}

export default combineReducers({
  app
});