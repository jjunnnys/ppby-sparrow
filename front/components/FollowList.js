import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { List, Button, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';

const FollowList = ({ header, data }) => {
  const dispatch = useDispatch();

  const onCencel = useCallback(
    // 고차함수를 사용해서 id 값을 파라미터로 가져온다.
    (id) => () => {
      if (header === '팔로잉 목록') {
        dispatch({
          type: UNFOLLOW_REQUEST,
          data: id,
        });
      }
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: id,
      });
    },
    []
  );
  return (
    <List
      style={{ marginBottom: 20 }}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<span>{header}</span>}
      loadMore={
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <Button>더 보기</Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: '20px' }}>
          <Card
            actions={[<StopOutlined key="stop" onClick={onCencel(item.id)} />]}
          >
            {/* 반복문에 대한 데이터를 onClick(함수)으로 넘겨줄 경우 각 item 마다 id를 넣어줘야 하기 때문에 고차함수를 사용  */}
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.prototype = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default FollowList;
