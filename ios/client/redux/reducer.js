import * as types from './action_constants';

const initalState = {
  language: 'english',
  gender: 'male',
  targetWord: null,
  percentCorrect: null,
}

export default function vocalizeReducer( state = initalState, action){
  switch(action.types) {

  case: types.REQUEST_NEXT_WORD:
    return Object.assign({}, state, {
      targetWord: action.requestNextWord,
      percentCorrect: null
    });

  case: types.PLAY_WORD:
    return action.play;

  case: types.RECORD_USER_AUDIO:
    return action.record;

  case: types.STOP_RECORDING_USER_AUDIO:
    return Object.assign({}, state, {
      percentCorrect: action.stopUserRecording
    });

  default: 
    return state;
  }
}
