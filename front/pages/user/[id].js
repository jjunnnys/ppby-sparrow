// 특정 사용자의 게시글 다 가져오기
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card } from 'antd';
import { END } from 'redux-saga';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';

import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from '../../reducers/user';
import PostCard from '../../components/PostCard';
import AppLayout from '../../components/AppLayout';
import wrapper from '../../store/configuerStore';

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query; // 특정 사용자 id를 받는다
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );
  const { otherUserInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1]?.id,
            data: id,
          });
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length, hasMorePosts, id, loadPostsLoading]);

  return (
    <AppLayout>
      <Head>
        <title>
          {otherUserInfo.nickname}
          님의 글 목록
        </title>
        <meta
          name="description"
          content={`${otherUserInfo.nickname}님의 게시글`}
        />
        <meta
          property="og:title"
          content={`${otherUserInfo.nickname}님의 게시글`}
        />
        <meta
          property="og:description"
          content={`${otherUserInfo.nickname}님의 게시글`}
        />
        <meta property="og:image" content="https://nodebird.com/favicon.ico" />
        <meta property="og:url" content={`https://nodebird.com/user/${id}`} />
      </Head>
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
          />
        </Card>
      ) : null}
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </AppLayout>
  );
};

// 다이나믹 라우팅일 경우 getStaticProps쓰려면 getStaticPath를 같이 쓴다. -> 그래야지 렌더링이 된다.
// 미리 렌더링을 통해 html로 만들기 떄문에 제한된 컨텐츠일 경우 사용 (개인 블로그 글 등)
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: context.params.id,
    });
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_USER_REQUEST,
      data: context.params.id,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default User;
