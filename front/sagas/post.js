import { all, fork, takeLatest, delay, put } from 'redux-saga/effects';
import axios from 'axios';
import shortid from 'shortid';
import {
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_FAILURE,
} from '../reducers/post';
import {
  ADD_POST_TO_USER_INFO,
  REMOVE_POST_OF_USER_INFO,
} from '../reducers/user';

const addPostAPI = (data) => {
  return axios.post('/api/post', data);
};

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    /* 
      saga는 동시에 여러 액션을 디스패치 할 수 있음
      -> 만약 어떤 동작이 여러 리듀서의 데이터를 바꿔야 한다면 액션을 여러번 호출
    */
    const id = shortid.generate();
    yield put({
      type: ADD_POST_SUCCESS,
      data: {
        id,
        content: action.data,
      },
    });
    yield put({
      type: ADD_POST_TO_USER_INFO,
      data: id,
    });
  } catch (error) {
    yield put({
      type: ADD_POST_FAILURE,
      data: error.response.data,
    });
  }
}

const removePostAPI = (data) => {
  return axios.post('/api/post', data);
};

function* removePost(action) {
  try {
    // const result = yield call(removePostAPI, action.data);
    /* 동시에 다른 리듀서를 바꿀 순 없기 때문에 action을 두 번 사용 */
    yield delay(1000);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data, // id 가 들어 있음
    });
    yield put({
      type: REMOVE_POST_OF_USER_INFO,
      data: action.data, // id 가 들어 있음
    });
  } catch (error) {
    yield put({
      type: REMOVE_POST_FAILURE,
      data: error.response.data,
    });
  }
}

const addCommentAPI = (data) => {
  return axios.post(`/api/post/${data.postId}/comment`, data);
};

function* addComment(action) {
  try {
    // const result = yield call(addCommentAPI, action.data);
    yield delay(1000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: error.response.data,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchRemovePost), fork(watchAddComment)]);
}
