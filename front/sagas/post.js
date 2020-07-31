import { all, fork, takeLatest, delay, put } from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_COMMENT_REQUEST,
  addComment,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
} from '../reducers/post';

const addPostAPI = (data) => {
  return axios.post('/api/post', data);
};

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    yield put({
      type: ADD_POST_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: ADD_POST_FAILURE,
      data: error.response.data,
    });
  }
}

const addCommentAPI = (data) => {
  return axios.post(`/api/post/${data.postId}/comment`, data);
};

function* addPost(action) {
  try {
    // const result = yield call(addCommentAPI, action.data);
    yield delay(1000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
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

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchAddComment)]);
}
