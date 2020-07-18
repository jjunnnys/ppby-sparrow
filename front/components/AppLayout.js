import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'; // react의 router의 기능

// 레이아웃은 여러개 만들 수 있음
const AppLayout = ({ children }) => {
  return (
    <div>
      <Link href="/">
        <a>노드버드</a>
      </Link>
      {children}
    </div>
  );
};

// props로 넘기는 애들은 proptypes로 검사
AppLayout.prototype = {
  children: PropTypes.node.isRequired, // 화면에 그릴 수 있는게 node (리액트에서의 노드)
};

export default AppLayout;
