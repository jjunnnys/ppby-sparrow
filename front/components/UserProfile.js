import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoggingOut } = useSelector((state) => state.user);

  const onLogout = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">
          <dl>
            <dt>짹짹</dt>
            <dd>0</dd>
          </dl>
        </div>,
        <div key="followings">
          <dl>
            <dt>팔로잉</dt>
            <dd>0</dd>
          </dl>
        </div>,
        <div key="follower">
          <dl>
            <dt>팔로워</dt>
            <dd>0</dd>
          </dl>
        </div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
        title={userInfo.nickname}
      />
      <Button onClick={onLogout} loading={isLoggingOut}>
        로그아웃
      </Button>
    </Card>
  );
};

export default UserProfile;
