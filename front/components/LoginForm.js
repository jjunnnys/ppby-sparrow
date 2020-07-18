import React, { useState, useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/Link';

const LoginForm = () => {
  // 나중에는 form 관련 리액트 라이브러리 사용해 보기
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // 컴포넌트에 프롭스로 넘겨주는 함수는 useCallback 쓰기 -> 최적화
  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  return (
    <Form>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input
          type="email"
          name="user-id"
          value={id}
          onChange={onChangeId}
          required
        />
      </div>
      <div>
        <label htmlFor="user-password">패스워드</label>
        <br />
        <Input
          type="password"
          name="user-password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <div>
        <Button type="primary" htmlType="submit" loading={false}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
