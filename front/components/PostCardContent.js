import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

/* 여기서의 작업은 그냥 문자열이면 문자열 만약 해시태그면 해시태그로 바꿔줌 */
// 예시 : 첫 번째 게시글 #해시태그 #익스프레스

const PostCardContent = ({ postData }) => {
  // 해스태그 추출하기 (정규표현식)
  // 사용자들이 기상천외한 방식으로 글을 쓸 수 있기 때문에
  return (
    <div>
      {/* split에선 정규표현식을 괄호로 감싸줘야 함 (포함 관계가 있음) */}
      {/* slice(1) 은 앞에 #를 땐다. */}
      {postData.split(/(#[^\s#]+)/g).map((value, index) => {
        if (value.match(/(#[^\s#]+)/g)) {
          // 반복문 도는 대상과 해시태그가 일치하는지 판별 -> match
          return (
            <Link href={`/hashtag/${value.slice(1)}`} key={index}>
              {/* 글을 수정할 때만 값이 바뀜 즉, 평소에 자주 바뀌진 않는다.*/}
              {/* 사용자 의도가 없으면 절대 바뀔 일이 없는 postData */}
              <a>{value}</a>
            </Link>
          );
        }
        return value;
      })}
    </div>
  );
};

PostCardContent.prototype = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
