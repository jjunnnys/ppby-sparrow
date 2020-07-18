import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'; // react의 router의 기능
import { Menu, Input, Row, Col } from 'antd';
import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import styled from 'styled-components';

// 컴포넌트 자체를 스타일링 하는 거면 이렇게 표현
const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

// 레이아웃은 여러개 만들 수 있음 (특정 컴포넌트의 공통사항)
const AppLayout = ({ children }) => {
  const [isLogedIn, setIsLogedIn] = useState(false); // 백엔드 서버가 없어 연습 용 더미 데이터 만듬

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput
            enterButton
            // style={{ verticalAlign: 'middle' }} -> 인라인 스타일은 리렌더링 최적화가 안된다.
            // 이런 식으로 객체를 넣어주면 안된다. ( {} === {} -> false가 뜸, 즉 virtual DOM이 검사하면서 값이 바꼈으니 리렌더링을 시킴)
          />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row
        gutter={8} // 컬럼 사이에 간격 주기(두 컬럼 사이를 8px로 띄움)
      >
        {/* xs: 모바일, sm: 태블릿, md: 작은 데스크탑  -> n/24라고 생각, 한 Row의 합은 24가 되어야 함 */}
        <Col xs={24} md={6}>
          {isLogedIn ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://velog.io/@ppby"
            target="_blank" // _blank을 쓰면 보안 위험이 있어
            rel="noreFerrer noopener" // <- 이 걸 작성
          >
            ppby 블로그
          </a>
        </Col>
      </Row>
    </div>
  );
};

// props로 넘기는 애들은 proptypes로 검사
AppLayout.prototype = {
  children: PropTypes.node.isRequired, // 화면에 그릴 수 있는게 node (리액트에서의 노드)
};

export default AppLayout;
