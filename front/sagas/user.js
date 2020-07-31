import { all, fork, takeLatest, delay, put } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_IN_REQUEST,
  LOG_OUT_REQUEST,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
} from '../reducers/user';

const logInAPI = () => {
  return axios.post('/api/login');
};

function* logIn(action) {
  console.log('saga login');
  try {
    // const result = yield call(logInAPI)
    yield delay(1000);
    yield put({
      type: LOG_IN_SUCCESS,
      data: action.data, // loginRequest에서 들어 온 데이터를 SUCCESS로 보냄
    });
  } catch (error) {
    yield put({
      type: LOG_IN_FAILURE,
      error: error.response.data,
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
      type: LOG_OUT_SUCCESS,
      data: null,
    });
  } catch (error) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: error.response.data,
    });
  }
}

const signUpAPI = () => {
  return axios.post('/api/signup');
};

function* signUp() {
  try {
    // const result = yield call(signUpAPI)
    yield delay(1000);
    yield put({
      type: SIGNUP_SUCCESS,
      data: null,
    });
  } catch (error) {
    yield put({
      type: SIGNUP_FAILURE,
      error: error.response.data,
    });
  }
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGNUP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([fork(watchLogIn), fork(watchLogOut), fork(watchSignUp)]);
}
