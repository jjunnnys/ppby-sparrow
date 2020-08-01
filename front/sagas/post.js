import {
  all,
  fork,
  takeLatest,
  delay,
  put,
  throttle,
} from 'redux-saga/effects';
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
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  generateDummyPost,
} from '../reducers/post';
import {
  ADD_POST_TO_USER_INFO,
  REMOVE_POST_OF_USER_INFO,
} from '../reducers/user';

const loadPostsAPI = () => {
  return axios.get('/api/posts');
};

function* loadPosts(action) {
  try {
    // const result = yield call(loadPostsAPI, action.data);
    yield delay(1000);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: generateDummyPost(10),
    });
  } catch (error) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      data: error.response.data,
    });
  }
}

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

function* watchLoadPosts() {
  // throttle -> 너무 많은 스크롤 이벤트를 5초 안에 한 번만 실행 (하지만 요청된 REQUEST액션은 취소를 안한다.)
  // 응답에 대한 것만 차단, 요청은 차단 못함
  // 그러기 위해서 처음부터 요청을 안 보내면 된다. hasMorePosts && !loadPostsLoading
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);

  /* 메모리 절약을 위한 -> react-virtualized 사용 */
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
    fork(watchLoadPosts),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchAddComment),
  ]);
}
