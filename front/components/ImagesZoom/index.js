import React, { useState } from 'react';
import Proptype from 'prop-types';
import Slick from 'react-slick';
import {
  Overlay,
  Global,
  Header,
  CloseButton,
  SlickWrapper,
  ImageWrapper,
  Indicator,
} from './styles';

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseButton onClick={onClose} />
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            beforeChange={(slide) => setCurrentSlide(slide)}
            infinite
            arrows={false}
            slidesToShow={1} // 한번에 하나씩 슬라이드 넘김
            slidesToScroll={1}
          >
            {images.map((v) => (
              <ImageWrapper key={v.src}>
                <img src={v.src} alt={v.src} />
              </ImageWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1} /{images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.prototype = {
  images: Proptype.arrayOf(Proptype.object).isRequired,
  onClose: Proptype.func.isRequired,
};

export default ImagesZoom;
