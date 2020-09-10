// import React from 'react' ;  next에서는 꼭 안 써도 된다.
/* 폴더 이름은 꼭 pages로 지정 -> next가 인식해서 여기 안에 있는 파일을 개별적인 페이지로 만들어 줌 (코드 스플리팅) */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configuerStore';

const Home = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const {
    mainPosts,
    hasMorePosts,
    loadPostsLoading,
    retweetError,
  } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    // 스크롤 현재 위치 파악
    const onScroll = () => {
      // 많이 쓰는 스크롤 위치 파악하는 함수
      // console.log(
      // eslint-disable-next-line max-len
      //   `얼마나 내렸는지(화면 위에 기준) :${window.scrollY} | 화면에 보이는 길이 :${document.documentElement.clientHeight} | 총 길이 :${document.documentElement.scrollHeight}`
      // );

      // 화면 끝에서 300px 위에서 데이터 불러오기
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        // 기존에 로딩하고 있을 떈 밑에 부분이 실행 안된다.
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id; // 마지막 게시글의 id
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    };

    window.addEventListener('scroll', onScroll); // 주의 클린업 함수로 window를 제거 해야함
    return () => {
      window.removeEventListener('scroll', onScroll); // 이 작업을 안하면 메모리에 계속 쌓여있는다.
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {userInfo && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

// 온전히 프론트서버에서만 실행되는 부분임 (다른 건 브라우저랑 같이 실행)
// Home 보다 먼저 그려진다.
// 이 부분에서 dispatch를 하면 스토어에 변화가 생긴다.
// 밑에서 실행된 결과를 HIDERATE로 보내준다.
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
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    // 지금 상태에선 SUCCESS를 기다리지 못하고 반환된다. -> 보완하기 위해 END 사용 (기다려 줌)
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise(); // (사용법) store에 등록한 sagaTask
  }
);

export default Home;
