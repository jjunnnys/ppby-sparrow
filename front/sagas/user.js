import { all, fork, takeLatest, delay, put } from 'redux-saga/effects';
import axios from 'axios';

const logInAPI = () => {
  return axios.post('/api/login');
};

function* logIn(action) {
  console.log('saga login');
  try {
    // const result = yield call(logInAPI)
    yield delay(1000);
    yield put({
      type: 'LOG_IN_SUCCESS',
      data: action.data, // loginRequest에서 들어 온 데이터를 SUCCESS로 보냄
    });
  } catch (error) {
    yield put({
      type: 'LOG_IN_FAILURE',
      data: action.data,
    });
  }
}

const logOutAPI = () => {
  return axios.post('/api/logout');
};

function* logOut() {
  try {
    // const result = yield call(logOutAPI)
    yield delay(1000);
    yield put({
      type: 'LOG_OUT_SUCCESS',
      data: null,
    });
  } catch (error) {
    yield put({
      type: 'LOG_OUT_FAILURE',
      data: error,
    });
  }
}

function* watchLogIn() {
  yield takeLatest('LOG_IN_REQUEST', logIn);
}

function* watchLogOut() {
  yield takeLatest('LOG_OUT_REQUEST', logOut);
}

export default function* userSaga() {
  yield all([fork(watchLogIn), fork(watchLogOut)]);
}
