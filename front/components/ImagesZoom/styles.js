import styled, { createGlobalStyle } from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

export const Overlay = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Header = styled.header`
  header: 44px;
  background: white;
  position: relative;
  padding: 0;
  text-align: center;

  & h1 {
    margin: 0;
    font-size: 17px;
    color: #333;
    line-height: 44px;
  }
`;

export const CloseButton = styled(CloseOutlined)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 15px;
  line-height: 14px;
  cursor: pointer;
`;

export const SlickWrapper = styled.div`
  height: calc(100% - 44px);
  background: #090909;
`;

export const ImageWrapper = styled.div`
  text-align: center;
  padding: 32px;

  & img {
    margin: 0 auto;
    width: auto;
    max-height: 750px;
  }
`;

export const Indicator = styled.div`
  text-align: center;

  /* 자식 선택자 */
  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;

// 기존 slick 의 클래스에 스타일을 덮어 씀, 사용법 -> 컴포넌트 안에 아무 곳이나 넣어 둠
export const Global = createGlobalStyle`
    .slick-slide {
        display: inline-block;
    }
`;
