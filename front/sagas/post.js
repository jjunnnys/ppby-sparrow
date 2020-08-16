import {
  all,
  fork,
  takeLatest,
  delay,
  put,
  throttle,
  call,
} from 'redux-saga/effects';
import axios from 'axios';
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
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
} from '../reducers/post';
import {
  ADD_POST_TO_USER_INFO,
  REMOVE_POST_OF_USER_INFO,
} from '../reducers/user';

const likePostAPI = (data) => {
  // data 는 postId
  return axios.patch(`/post/${data}/like`); // 게시글에 일부분을 수정하기 떄문에 patch
};

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data, // 게시글들의 배열이 들어 있음
    });
  } catch (error) {
    yield put({
      type: LIKE_POST_FAILURE,
      data: error.response.data,
    });
  }
}

const unlikePostAPI = (data) => {
  return axios.delete(`/post/${data}/like`); // 최대한 요청, 응답을 가볍게 만들기 위해 두번 쨰 파라미터(data)는 제외(넣어도 되긴 함)
};

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data, // 게시글들의 배열이 들어 있음
    });
  } catch (error) {
    yield put({
      type: UNLIKE_POST_FAILURE,
      data: error.response.data,
    });
  }
}

const loadPostsAPI = (data) => {
  return axios.get('/posts', data);
};

function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.data);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data, // 게시글들의 배열이 들어 있음
    });
  } catch (error) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      data: error.response.data,
    });
  }
}

const addPostAPI = (data) => {
  return axios.post('/post', { content: data }); // req.body.content 가 data가 된다.
};

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data, // 서버에서 넘어온 데이터
    });
    yield put({
      type: ADD_POST_TO_USER_INFO,
      data: result.data.id,
    });
  } catch (error) {
    yield put({
      type: ADD_POST_FAILURE,
      data: error.response.data,
    });
  }
}

const removePostAPI = (data) => {
  return axios.delete(`/post/${data}`); // delete는 데이터를 못 넣는다.
};

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data, // PostId 가 들어 있음
    });
    yield put({
      type: REMOVE_POST_OF_USER_INFO,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: REMOVE_POST_FAILURE,
      data: error.response.data,
    });
  }
}

const addCommentAPI = (data) => {
  return axios.post(`/post/${data.postId}/comment`, data);
};

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: error.response.data,
    });
  }
}

function* watchLoadPosts() {
  // throttle -> 너무 많은 스크롤 이벤트를 5초 안에 한 번만 실행 (하지만 요청된 REQUEST액션은 취소를 안한다.)
  // 응답에 대한 것만 차단, 요청은 차단 못함
  // 그러기 위해서 처음부터 요청을 안 보내면 된다. hasMorePosts && !loadPostsLoading
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);

  /* 메모리 절약을 위한 -> react-virtualized 사용 */
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
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
  yield all([
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchLoadPosts),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchAddComment),
  ]);
}
