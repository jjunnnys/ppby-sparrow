// [id] 값이 계속 바뀜 -> 다이나믹 라우팅
import React from 'react';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import Head from 'next/head';

import { useSelector } from 'react-redux';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

const Post = () => {
  const router = useRouter();
  const { id } = router.query; // id를 사용해서 게시글을 렌더링할 수 있음

  const { singlePost } = useSelector((state) => state.post);

  return (
    <AppLayout>
      <Head>
        <title>{singlePost.User.nickname}님의 글</title>
        <meta name="description" content={singlePost.content} />
        {/* og -> 미리보기 기능 */}
        <meta
          property="og:title"
          content={`${singlePost.content}님의 게시글`}
        />
        <meta property="og:description" content={singlePost.content} />
        <meta
          property="og:image"
          content={
            singlePost.Images[0]
              ? singlePost.Images[0].src
              : 'https://nodebird.com/favicon.ico'
          }
        />
        <meta property="og:url" content={`https://nodebirde.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

// 로그인 여부에 따라 화면이 바뀔 수 있기 떄문에 getServerSideProps
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    console.log('context', context);
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    // 단일 게시글 불러오는 옵션
    context.store.dispatch({
      type: LOAD_POST_REQUEST,
      data: context.params.id, // useRouter와 같이 똑같이 url 쿼리에 접근할 수 있음
    });

    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default Post;
