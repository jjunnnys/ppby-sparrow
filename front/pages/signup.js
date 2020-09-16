import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Form, Input, Checkbox, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { END } from 'redux-saga';

import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const ErrorMessage = styled.div`
  color: red;
`;

const Signup = () => {
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState(false);

  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, userInfo } = useSelector(
    (state) => state.user
  );

  // 로그인 되었을 땐 회원가입 페이지에 들어가면 홈으로 리다이랙트
  useEffect(() => {
    if (userInfo && userInfo.id) {
      Router.replace('/'); // 검색기록에 안 남음 (push는 검색 기록에 남음)
    }
  }, [userInfo && userInfo.id]);

  useEffect(() => {
    // 회원가입 완료되면 메인페이지로 이동, 프로필하고 비슷
    if (signUpDone) {
      Router.replace('/');
    }
  }, [signUpDone]);

  useEffect(() => {
    // 빠르게 하기 위해 alert 사용, state를 이용해 화면에 그려줘도 된다.
    if (signUpError) {
      alert(signUpError); // 에러메세지는 백엔드에서 넘어온다.
    }
  }, [signUpError]);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  // eslint-disable-next-line consistent-return
  const onSubmit = useCallback(() => {
    // 한번 더 체크
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }

    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [email, password, passwordCheck, term]);

  return (
    <>
      <Head>
        <title>회원가입 | ppby sparrow</title>
      </Head>
      <AppLayout>
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor="user-email">이메일</label>
            <br />
            <Input
              name="user-email"
              type="email"
              value={email}
              required
              onChange={onChangeEmail}
            />
          </div>
          <div>
            <label htmlFor="user-nickname">닉네임</label>
            <br />
            <Input
              name="user-nickname"
              value={nickname}
              required
              onChange={onChangeNickname}
            />
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input
              name="user-password"
              type="password"
              value={password}
              required
              onChange={onChangePassword}
            />
          </div>
          <div>
            <label htmlFor="user-password-check">비밀번호 체크</label>
            <br />
            <Input
              name="user-password-check"
              type="password"
              value={passwordCheck}
              required
              onChange={onChangePasswordCheck}
            />
            {passwordError && (
              <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
            )}
          </div>
          <div>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
              가입을 동의합니다.
            </Checkbox>
            {termError && (
              <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit" loading={signUpLoading}>
              가입하기
            </Button>
          </div>
        </Form>
      </AppLayout>
    </>
  );
};

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

    // 지금 상태에선 SUCCESS를 기다리지 못하고 반환된다. -> 보완하기 위해 END 사용 (기다려 줌)
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise(); // (사용법) store에 등록한 sagaTask
  }
);

export default Signup;
