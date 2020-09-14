import React from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';

import AppLayout from '../components/AppLayout';
import { Avatar, Card } from '../node_modules/antd/lib/index';
import wrapper from '../store/configuerStore';
import { LOAD_USER_REQUEST } from '../reducers/user';

const About = () => {
  const { otherUserInfo } = useSelector((state) => state.user);

  return (
    <>
      <Head>
        <title>내 프로필 | ppby sparrow</title>
      </Head>
      <AppLayout>
        {otherUserInfo ? (
          <Card
            actions={[
              <div key="twit">
                짹짹
                <br />
                {otherUserInfo.Posts}
              </div>,
              <div key="following">
                팔로잉
                <br />
                {otherUserInfo.Followings}
              </div>,
              <div key="follower">
                팔로워
                <br />
                {otherUserInfo.Followers}
              </div>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar>{otherUserInfo.nickname[0]}</Avatar>}
              title={otherUserInfo.nickname}
              description="프론트 마스터"
            />
          </Card>
        ) : null}
        {/* 내 정보가 ssr이 안되면 텅빈 페이지가 나옴 */}
      </AppLayout>
    </>
  );
};

// getStaticProps로도 ssr이 가능하다
// 언제 접속해도 데이터가 바뀔일이 없을 경우 사용 (왠만해선 다 getServerSideProps 사용)
// -> build 시에 next에서 html로 만든다. (블로그 글, 커머스 이벤트 페이지 정도 )
export const getStaticProps = wrapper.getStaticProps(async (context) => {
  context.store.dispatch({
    type: LOAD_USER_REQUEST, // 특정한 사용자 가져오기
    data: 1,
  });
  context.store.dispatch(END); // SUCSESS까지 기다린다.
  await context.store.sagaTask.toPromise();
});

export default About;
