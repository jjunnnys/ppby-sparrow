// import React from 'react' ;  next에서는 꼭 안 써도 된다.
/* 폴더 이름은 꼭 pages로 지정 -> next가 인식해서 여기 안에 있는 파일을 개별적인 페이지로 만들어 줌 (코드 스플리팅) */

import { useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const Home = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);
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
