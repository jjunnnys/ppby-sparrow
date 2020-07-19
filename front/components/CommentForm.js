import React, { useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import useInput from '../hooks/useInput';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const CommentForm = ({ post }) => {
  const id = useSelector((state) => state.user.userInfo?.id); // 로그인 해야지 id가 생김
  const [commentText, onChangeCommentText] = useInput('');
  const onSubmitComment = useCallback(() => {
    // 게시글 아이디를 가져온다.
    console.log(post.id, commentText);
  }, [commentText]);
  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea
          value={commentText}
          onChange={onChangeCommentText}
          row={4}
        />
        <Button
          type="primary"
          htmlType="submit"
          style={{ position: 'absolute', right: 0, bottom: -40 }}
        >
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.prototype = {
  psot: PropTypes.object.isRequired,
};

export default CommentForm;
