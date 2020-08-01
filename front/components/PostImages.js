import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import ImagesZoom from './ImagesZoom';

// 이미지가 한개 이상있을 때 PostImages 컴포넌트가 작성된다.
const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        {/* 
          role="presentation" -> 
          스크린리더가 이걸 클릭은 할 수 있지만 꼭 클릭할 필요는 없다라고 알려 줌 (버튼이나 인풋이 아닌 태그에 onClick을 쓸 경우 작성) 
        */}
        <img
          role="presentation"
          src={images[0].src}
          alt={images[0].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img
          style={{
            width: '50%',
            display: 'inline-block',
          }}
          role="presentation"
          src={images[0].src}
          alt={images[0].src}
          onClick={onZoom}
        />
        <img
          style={{
            width: '50%',
            display: 'inline-block',
          }}
          role="presentation"
          src={images[1].src}
          alt={images[1].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  return (
    <>
      <img
        style={{
          width: '50%',
          display: 'inline-block',
        }}
        role="presentation"
        src={images[0].src}
        alt={images[0].src}
        onClick={onZoom}
      />
      <div
        role="presentation"
        style={{
          display: 'inline-block',
          width: '50%',
          textAlign: 'center',
          verticalAlign: 'middle',
        }}
      >
        <PlusOutlined onClick={onZoom} />
        <br />
        {images.length - 1}
        개의 사진 더보기
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.prototype = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
