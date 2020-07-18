// 페이지에 공통되는 것을 처리 (부모 노드 -> _app.js)

import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';

const App = ({ Component }) => {
  // 자식 컴포넌트(모든 페이지의 컴포넌트)의 공통적인 부분은 다 적으면 된다.
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>ppby sparrow</title>
      </Head>
      <Component />
    </>
  );
};

// 점검하여 안전성 높히기
App.prototype = {
  Component: PropTypes.elementType.isRequired,
};

export default App;
