import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
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
          짹짹
          <br />
          {userInfo.Posts.length}
        </div>,
        <div key="followings">
          팔로잉
          <br />
          {userInfo.Followings.length}
        </div>,
        <div key="followings">
          팔로워
          <br />
          {userInfo.Followers.length}
        </div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
        title={userInfo.nickname}
      />
      <Button onClick={onLogout} loading={logOutLoading}>
        로그아웃
      </Button>
    </Card>
  );
};

export default UserProfile;
