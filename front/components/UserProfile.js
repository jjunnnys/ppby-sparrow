import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userInfo, logOutLoading } = useSelector((state) => state.user);

  const onLogout = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">
          <Link href={`/user/${userInfo.id}`}>
            <a>
              짹짹
              <br />
              {userInfo.Posts.length}
            </a>
          </Link>
        </div>,
        <div key="followings">
          <Link href="/profile">
            <a>
              팔로잉
              <br />
            </a>
          </Link>
          {userInfo.Followings.length}
        </div>,
        <div key="followings">
          <Link href="/profile">
            <a>
              팔로워
              <br />
              {userInfo.Followers.length}
            </a>
          </Link>
        </div>,
      ]}
    >
      <Card.Meta
        avatar={
          <Link href={`/user/${userInfo.id}`}>
            <a>
              <Avatar>{userInfo.nickname[0]}</Avatar>
            </a>
          </Link>
        }
        title={userInfo.nickname}
      />
      <Button onClick={onLogout} loading={logOutLoading}>
        로그아웃
      </Button>
    </Card>
  );
};

export default UserProfile;
