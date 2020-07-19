/*
    - 컴포넌트를 만들 때 기획
    1. 크게 기능 그려보기
    2. 구현하기
*/
import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Popover, Button, Avatar } from 'antd';
import {
  RetweetOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import PostImages from './PostImages';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [commentFormOpend, setCommentFormOpend] = useState(false);

  const onToggleLike = useCallback(() => {
    // 토글 이벤트에선 항상 (prev)=>!prev (이전 데이터의 반대 값을 리턴)
    setLiked((prev) => !prev);
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpend((prev) => !prev);
  }, []);

  const { userInfo } = useSelector((state) => state.user);
  // 새로운 문법 ( userInfo && userInfo.id ) 와 동일 -> optional chaining
  const id = userInfo?.id;
  // 더 간단하게
  //   const { id } = useSelector((state) => state.user.userInfo?.id);
  return (
    <div style={{ marginTop: '20px' }}>
      <Card
        // 사진
        cover={post.Images[0] && <PostImages images={post.Images} />}
        // 버튼
        actions={[
          <RetweetOutlined key="retweet" />,
          liked ? (
            <HeartTwoTone
              twoToneColor="#eb2f96"
              key="heart"
              onClick={onToggleLike}
            />
          ) : (
            <HeartOutlined key="heart" onClick={onToggleLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          // ... 에 커서를 올렸을 떄 툴팁 박스 나옴
          <Popover
            key="more"
            content={
              <Button.Group>
                {/* 현재 내 id와 게시글 id와 같고 그 결과가 현재 내 id와 같을 경우 */}
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger">삭제</Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={post.content}
        />
      </Card>
      {commentFormOpend && <div>댓글 부분</div>}
      {/* <ConmmentForm />
        <Comments /> */}
    </div>
  );
};

// 초기 상태 모양으로 정해주면 된다.
PostCard.prototype = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;
