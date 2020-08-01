import React from 'react';
import Head from 'next/Head';
import { useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import NicknameEditFrom from '../components/NicknameEditFrom';
import FollowList from '../components/FollowList';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.post);

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
