import { all, fork, takeLatest, delay, put, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_IN_REQUEST,
  LOG_OUT_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_REQUEST,
  SIGN_UP_FAILURE,
  FOLLOW_REQUEST,
  UNFOLLOW_REQUEST,
  FOLLOW_FAILURE,
  FOLLOW_SUCCESS,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
} from '../reducers/user';

const followAPI = () => {
  return axios.post('/api/follow');
};

function* follow(action) {
  try {
    // const result = yield call(followAPI)
    yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: FOLLOW_FAILURE,
      error: error.response.data,
    });
  }
}

const unfollowAPI = () => {
  return axios.post('/api/unfollow');
};

function* unfollow(action) {
  try {
    // const result = yield call(unfollowAPI)
    yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: error.response.data,
    });
  }
}

const logInAPI = () => {
  return axios.post('/api/login');
};

function* logIn(action) {
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

const signUpAPI = (data) => {
  return axios.post('http://localhost:3065/user', data); // action을 통해 받아온 데이터를 req.body에 넣어 줌
};

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
      data: null,
    });
  } catch (error) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: error.response.data,
    });
  }
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}
