// 로컬 로그인 전략 세우기
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local'); // LocalStrategy 로 이름 변경
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // 프론트에서 넘어온 action.data 를 req.body에 담는다.
        passwordField: 'password',
      },
      async (email, password, done) => {
        // 비동기로 작업을 하면 서버에러가 있을 수 있음
        try {
          /* 전략 */
          const user = await User.findOne({
            where: {
              email,
            },
          });
          /* 1. 이메일 검사 */
          if (!user) {
            // 사용자가 없으면
            // done(서버에러, 성공, 클라이언트 에러)
            return done(null, false, { reason: '존재하지 않는 이메일입니다.' });
          }
          const result = await bcrypt.compare(password, user.password); // 사용자가 입력한 패스워드와 데이터베이스에 저장된 패스워드 비교
          /* 2. 패스워드 검사 */
          if (result) {
            // 패스워드가 맞으면
            return done(null, user); // 성공 자리에 사용자 정보 넘겨주기
          }
          // 패스워드가 틀리면
          return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
        } catch (error) {
          console.error(error);
          return done(error); // 서버 에러를 담아 준다.
        }
      }
    )
  );
};
