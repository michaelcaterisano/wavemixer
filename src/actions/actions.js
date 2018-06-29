export function setFileId(id) {
  return { type: 'SET_FILE_ID', id}
};

export function setFileName(name) {
  return { type: 'SET_FILE_NAME', name}
};

export function togglePlaying() {
  return { type: 'TOGGLE_PLAYING'}
};

export function setPlaying(bool) {
  return { type: 'SET_PLAYING', bool}
};

export function setBegining(bool) {
  return { type: 'SET_BEGINING', bool}
};

export function toggleCycle() {
  return { type: 'TOGGLE_CYCLE'}
};

export function addAudioFile(file) {
  return { type: 'ADD_AUDIO_FILE', file}
};

export function editAudioFiles(files) {
  return { type: 'EDIT_AUDIO_FILES', files}
};

export function setOptions(options) {
  return { type: 'SET_OPTIONS', options}
};

export function setProgress(progress) {
  return { type: 'SET_PROGRESS', progress}
};
