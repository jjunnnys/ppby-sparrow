/*
  간편 로그인 관리 : passport
  직접 아이디 생성 : passport-local
*/

const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

// 기본 세팅
module.exports = () => {
  passport.serializeUser((user, done) => {
    // user.js에서 req.login 과 같이 실행, 파라미터로 그대로 가져온다.
    done(null, user.id); // 세션에서 다 들고 있기 무거워서, 쿠키랑 묶어 줄 id를 저장
  });

  // 로그인 이후부터는 이 부분이 라우터가 실행되기 전에 계속 실행 됨 (DB에 id를 통해서 사용자 정보를 복구함)
  passport.deserializeUser(async (id, done) => {
    try {
      // DB에서 id 값을 통해 데이터를 가져온다.
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user 안에 넣어 준다.
    } catch (error) {
      console.log(error);
      done(error);
    }
  });
  local();
};
