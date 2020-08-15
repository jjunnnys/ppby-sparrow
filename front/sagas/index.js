import { all, fork } from 'redux-saga/effects'; // saga effect
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';

/*
  all : 함수 전부를 실행
  call, fork : 함수 하나를 실행
  take : 일회용이다. (한번하고 사라짐) -> 대신해서 takeEvery 또는 takeLatest를 사용(비동기 처리)
    -> 서버 쪽에서 똑같은 데이터가 저장 안되게 검사를 해야한다. -> throttle 을 사용하면 정해진 시간안에 요청을 한번만 보낼 수 있다.
    -> 특별한 경우가 아니면 takeLatest를 이용하고 서버 쪽에서 검증을 한다.
  delay : 서버가 없을 땐 비동기 작업을 하기위해 사용
  ---
  call : 동기 함수 호출
  fork : 비동기 함수 호출
  ---
  yield 같은 걸 많이 넣어 놓을 수록 test 환경에서 유리하다.
*/

axios.defaults.baseURL = 'http://localhost:3065';
// 중복되는 건 index에 적음
axios.defaults.withCredentials = true; // 쿠키 전달(다른 도메인 주소일 경우) -> !! true일 경우 origin: * 이면 안된다. 무조건 주소를 똑바르게 적어라

export default function* rootSaga() {
  yield all([
    // all 은 배열 형태로 한방에 함수들을 다 실행
    // fork 는 함수를 실행하는 것 -> 그냥 watchLogIn() 하면 안되나...?
    fork(postSaga),
    fork(userSaga),
  ]);
}
