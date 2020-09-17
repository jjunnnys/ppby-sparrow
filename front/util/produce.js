// IE 11버전을 지원하기 위해 사용
// 소스코드 시작되는 부분에 코드를 넣으면 된다. (react에선 index.js 부분에 넣는다.)
// next는 render 함수가 따로 없음
import { enableES5, produce } from 'immer';

export default (...args) => {
  enableES5();
  return produce(...args);
};
