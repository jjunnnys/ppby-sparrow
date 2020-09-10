import React, { useEffect } from 'react';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';

import AppLayout from '../components/AppLayout';
import NicknameEditFrom from '../components/NicknameEditFrom';
import FollowList from '../components/FollowList';
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
} from '../reducers/user';

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

export default Profile;
