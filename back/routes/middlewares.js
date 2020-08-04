/* 중복되는 코드를 커스텀 미들웨어로 만든다. */

exports.isLoggedIn = (req, res, next) => {
  // passport에서 제공함
  if (req.isAuthenticated()) {
    next();
    /* 
     next의 사용 방법
     - 파라미터를 넣으면 에러처리
     - next() 만 적으면 다음 미들웨어로 간다.
    */
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  // passport에서 제공함
  if (!req.isAuthenticated()) {
    next();
    /* 
       next의 사용 방법
       - 파라미터를 넣으면 에러처리
       - next() 만 적으면 다음 미들웨어로 간다.
      */
  } else {
    res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
  }
};
