import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';

const UserProfile = ({ setIsLoggedIn }) => {
  const onLogout = useCallback(() => {
    setIsLoggedIn(false);
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
      <Card.Meta avatar={<Avatar>ppby</Avatar>} title="pepper boy" />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
