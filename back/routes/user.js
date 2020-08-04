const express = require('express');
const bcrypt = require('bcrypt'); // 패스워드 암호화 라이브러리
const { User } = require('../models');
const router = express.Router();

/*
  요청/응답은 헤더(상태, 용량, 시간, 쿠키) 와 바디(데이터)로 구성
  200 성공
  300 리다이렉트
  400 클라이언트 에러
  500 서버 에러

  - Access-Control-Allow-Origin -> 이 헤더가 없으면 XMLHttpRequest 에러가 뜬다. (Reaquest Headers)
  - 브라우저(3060)에서 다른 도메인(3065)으로 요청을 보내면 브라우저에서 차단을 한다. (CORS)
  - 서버(3060)에서 서버(3065)로 요청을하면 CORS가 안 생긴다.
    -> 이 방법으로 해결 : 브라우저에서 프론트 서버로 요청을 보냄 (같은 도메인이라서 CORS 가 안생김)
    -> 구조 : 브라우저 => 프론트 => 백 => 프론트 => 브라우저 -> 프록시 방식
  - 또 다른 방법 res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060')
    -> 3060에서 오는 요청은 허용하겠다. (차단은 브라우저가 하는데 허용은 서버에서 한다.)
  - 하지만 편하게 미들웨어로 처리
*/

// 라우터를 일치하게 만들어 줌
router.post('/', async (req, res, next) => {
  try {
    // (공식문서 보고 비동기 함수인지 찾는다.) exUser에 req.body.email이 기존 테이블 안에 있는지 확인해서 exUser에 담는다. (없으면 null)
    const exUser = await User.findOne({
      // 말 그대로 하나를 User 테이블에서 찾는다.
      // 찾을 때 : where
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
      // return 안 붙히면 응답을 두 번 보낸다. / send 부분이 error.response.data 가 된다.
    }
    // bcrypt도 비동기라서 await을 붙힌다. / 숫자를 높게 할 수록 암호화 강도가 높아 짐 단, 오래걸린다 (1초 정도 걸리는 시간으로 설정)
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    // User.create는 비동기 함수라서 await으로 순서를 만들어 줌
    await User.create({
      // 테이블 안에 데이터를 넣는다.
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send('회원가입 성공'); // 의미 있게 201 사용 (잘 생성됨)
  } catch (error) {
    console.error(error);
    // next 로 error를 내 보낸다. 이런 식으로 error를 모아서 나중에 한번에 처리할 수 있다.
    next(error); // status 500
  }
});

module.exports = router;
