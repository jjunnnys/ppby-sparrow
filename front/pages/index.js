// import React from 'react' ;  next에서는 꼭 안 써도 된다.
/* 폴더 이름은 꼭 pages로 지정 -> next가 인식해서 여기 안에 있는 파일을 개별적인 페이지로 만들어 줌 (코드 스플리팅) */

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );

  // 페이지 접속할 때 사용자 정보와 게시글 불러 옴 (전체 정보를 채워서 준다.)
  useEffect(() => {
    dispatch({
      // 매번 로그인 상태 복구해 주기 위해서
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  useEffect(() => {
    // 스크롤 현재 위치 파악
    const onScroll = () => {
      // 많이 쓰는 스크롤 위치 파악하는 함수
      // console.log(
      //   `얼마나 내렸는지(화면 위에 기준) :${window.scrollY} | 화면에 보이는 길이 :${document.documentElement.clientHeight} | 총 길이 :${document.documentElement.scrollHeight}`
      // );

      // 화면 끝에서 300px 위에서 데이터 불러오기
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        // 기존에 로딩하고 있을 떈 밑에 부분이 실행 안된다.
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
          });
        }
      }
    };
    window.addEventListener('scroll', onScroll); // 주의 클린업 함수로 window를 제거 해야함
    return () => {
      window.removeEventListener('scroll', onScroll); // 이 작업을 안하면 메모리에 계속 쌓여있는다.
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {userInfo && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export default Home;
