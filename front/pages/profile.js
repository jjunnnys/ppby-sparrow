import React from 'react';
import Head from 'next/Head';
import AppLayout from '../components/AppLayout';

const Profile = () => {
  return (
    <>
      <Head>
        <title>내 프로필 | ppby sparrow</title>
      </Head>
      <AppLayout>
        <div>프로필 페이지</div>
      </AppLayout>
    </>
  );
};
// profile의 retrun 부분이 _app.js 의 App 컴포넌트로 들어간다.

export default Profile;
