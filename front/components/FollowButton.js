import React, { useCallback } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST, FOLLOW_REQUEST } from '../reducers/user';

const FollowButton = ({ post }) => {
  // 팔로우 한지 안 한지 확인하기
  const { userInfo, followLoading, unfollowLoading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  // 나의 팔로잉 에서 포스트 작성자의 id와 같을 경우 (팔로잉 여부)
  const isFollowing = userInfo?.Followings.find(
    (value) => value.id === post.User.id
  );

  const onClickButton = useCallback(() => {
    // 팔로잉 중인데 버튼을 누른 경우 (언팔로)
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        // 작성자의 id만 있으면 팔로우 언팔로우 가능
        data: post.User.id,
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: post.User.id,
      });
    }
  }, [isFollowing]);
  return (
    <Button
      // loading -> 둘 중 하나라도 true면 로딩이 된다.
      loading={followLoading || unfollowLoading}
      onClick={onClickButton}
    >
      {isFollowing ? '언팔로우' : '팔로우'}
    </Button>
  );
};

FollowButton.prototype = {
  post: PropTypes.object.isRequired, // shape로 바꾸기
};

export default FollowButton;
