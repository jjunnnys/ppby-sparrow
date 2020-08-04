/*
  간편 로그인 관리 : passport
  직접 아이디 생성 : passport-local
*/

const passport = require('passport');
const local = require('./local');

// 기본 세팅
module.exports = () => {
  passport.serializeUser(() => {});
  passport.deserializeUser(() => {});
  local();
};
