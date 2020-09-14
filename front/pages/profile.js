import React, { useEffect } from 'react';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';

import AppLayout from '../components/AppLayout';
import NicknameEditFrom from '../components/NicknameEditFrom';
import FollowList from '../components/FollowList';
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_MY_INFO_REQUEST,
} from '../reducers/user';
import wrapper from '../store/configuerStore';

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, [dispatch]);

  // 로그인이 안 됐을 떄 프로필 못 가게 하기 (리다이렉트)
  useEffect(() => {
    if (!(userInfo && userInfo.id)) {
      Router.push('/');
    }
  }, [userInfo && userInfo.id]);

  if (!userInfo) {
    return null;
  }

  return (
    <>
      <Head>
        <title>내 프로필 | ppby sparrow</title>
      </Head>
      <AppLayout>
        {/* 처음 페이지 설계시 컴포넌트를 만들지 않아도 어떤 컴포넌트가 들어가는지 생각해서 미리 작성(props도 미리 설정) */}
        <NicknameEditFrom />
        <FollowList header="팔로잉 목록" data={userInfo.Followings} />
        <FollowList header="팔로워 목록" data={userInfo.Followers} />
      </AppLayout>
    </>
  );
};
// profile의 retrun 부분이 _app.js 의 App 컴포넌트로 들어간다.

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    console.log('context', context);

    // 브라우저는 개입을 못함 그래서 프론트 서버에서 쿠키를 담아서 보내줘야 cors 해결
    // 브라우저에서 요청을 보낼 땐 쿠키를 자동으로 보내줬다.
    // 서버 쪽에서 실행되면 context.req가 존재
    const cookie = context.req ? context.req.headers.cookie : '';
    /* 쿠키 공유 문제 해결 법 */
    axios.defaults.headers.Cookie = ''; // 쿠키 안쓰고 요청 보낼 땐 서버에서 공유하고 있는 쿠키 비우기
    if (context.req && cookie) {
      // 내 쿠키가 다른 사람에게 주는 것 방지
      axios.defaults.headers.Cookie = cookie; // 쿠키를 써서 잠깐 요청을 보낼 때만 쿠키를 넣어 놓음
    }

    context.store.dispatch({
      // 매번 로그인 상태 복구해 주기 위해서
      type: LOAD_MY_INFO_REQUEST,
    });

    // 지금 상태에선 SUCCESS를 기다리지 못하고 반환된다. -> 보완하기 위해 END 사용 (기다려 줌)
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise(); // (사용법) store에 등록한 sagaTask
  }
);

export default Profile;
