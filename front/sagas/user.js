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
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  CHANGE_NICKNAME_FAILURE,
} from '../reducers/user';

const changeNicknameAPI = (data) => {
  return axios.patch('/user/nickname', { nickname: data });
};

function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data);
    yield delay(1000);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: error.response.data,
    });
  }
}

const loadMyInfoAPI = () => {
  return axios.get('/user'); // get 하고 delete는 data가 없어서 두번째 자리가 {쿠키전달} 이다.
};
// 더 깔끔하게 서버에서 로드될 때부터 정보를 가져오려면 ssr이 필요하다.
function* loadMyInfo(action) {
  try {
    const result = yield call(loadMyInfoAPI, action.data);
    yield delay(1000);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: error.response.data,
    });
  }
}

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

const logInAPI = (data) => {
  return axios.post('/user/login', data);
};

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data, // 서버로부터 사용자 정보 받아 온다.
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOG_IN_FAILURE,
      error: error.response.data,
    });
  }
}

const logOutAPI = () => {
  return axios.post('/user/logout');
};

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: error.response.data,
    });
  }
}

const signUpAPI = (data) => {
  return axios.post('/user', data); // action을 통해 받아온 데이터를 req.body에 넣어 줌
};

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (error) {
    // 서버에서 400번, 500번 대에 chatch로 온다.
    yield put({
      type: SIGN_UP_FAILURE,
      error: error.response.data,
    });
  }
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
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
    fork(watchChangeNickname),
    fork(watchLoadMyInfo),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}
