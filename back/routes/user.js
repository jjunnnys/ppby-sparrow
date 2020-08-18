const express = require('express');
const bcrypt = require('bcrypt'); // 패스워드 암호화 라이브러리
const passport = require('passport');

const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

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

/* user 정보 가져오기 */
// GET /user
router.get('/', async (req, res, next) => {
  // 사용자 정보 복구(새로고침을 하면 이 요청이 간다. 단, 로그아웃된 상태여도 요청이 가서 수정)
  try {
    if (req.user) {
      // 짧은 정보만 불러오면 에러가 생김
      // const user = await User.findOne({
      //   where: { id: req.user.id }, -> 로그아웃 상태이면 여기서 에러가 발생함 확실하게 if로 확인
      // });

      /* 모든 정보를 집어 넣은 유저 (비밀번호는 빼고) */
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        // 필요한 필드만 가져오기
        attributes: {
          exclude: ['password'],
        },
        include: [
          // User 모델에서 가져오기 (다른 테이블과의 관계를 자동으로 합쳐준다.)
          {
            model: Post, // hasMany라서 'model: post' 가 복수형이 되어서 userInfo.Posts가 된다.
            attributes: ['id'], // 필요 없는 데이터는 안 가져오게 id만 가지고 숫자를 센다.
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null); // 없다면 아무것도 안보내주면 된다.
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 로그인 */
// POST /user/login
router.post('/login', isNotLoggedIn, (req, res, next) => {
  // 이렇게 하면 미들웨어를 확장 (express 기법)
  passport.authenticate('local', (err, user, info) => {
    // (파라미터 이름은 마음대로) done에서 받아온 값 (콜백함수 같음)
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason); // 401: 허가되지 않음
      /* 쿠키가 전달이 돼야만 백엔드에서 어떤 사람이 요청을 보냈는지 알 수 있다, */
      /* 여기서 문제 점 백엔드와 프론트엔드의 서버가 다르면 쿠키가 전달이 안됨, 그래서 로그인을 했는데도 401 Unauthorized 에러가 뜬다. */
    }
    // passport에 로그인
    return req.login(user, async (loginErr) => {
      // 혹시나 passport에서 로그인할 때 에러날 수 있어서 만들어 준다.
      if (loginErr) {
        console.log(loginErr);
        return next(loginErr);
      }

      // 모든 정보를 집어 넣은 유저 (비밀번호는 빼고)
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // 필요한 필드만 가져오기
        attributes: {
          exclude: ['password'],
        }, // 제외 시키는 방법으론 exclude: [''] 이런 식으로 작성
        include: [
          // User 모델에서 가져오기 (다른 테이블과의 관계를 자동으로 합쳐준다.)
          {
            model: Post, // hasMany라서 'model: Post' 가 복수형이 되어서 userInfo.Posts가 된다.
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });

      return res.status(200).json(fullUserWithoutPassword); // 내가 원하는 데이터만 프론트로 넘긴다.(fullUserWithoutPassword)
      // loginErr가 없으면 서비스 로그인과 passport 로그인이 성공
    });
  })(req, res, next); // (req, res, next) 를 쓰기 위해 이렇게 작성
}); // POST /user/login

/* 로그아웃 */
// POST /user/logout
router.post('/logout', isLoggedIn, (req, res, next) => {
  // 로그인 이후에는 req.user에 사용자 정보가 들어가 있음
  try {
    // 세션 지우고 쿠키 지우기
    req.logOut();
    req.session.destroy();
    res.send('로그아웃 성공');
  } catch (error) {
    next(error);
  }
});

/* 회원가입 */
// POST /user
router.post('/', isNotLoggedIn, async (req, res, next) => {
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

/* 닉네임 변경 */
// PATCH /nickname
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname, // 프론트에서 제공하는 nickname으로 수정
      },
      // 조건
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 팔로잉 하기 */
// PATCH /user/1/follow
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } }); // userId가 들어 있는지 확인
    if (!user) {
      res.status(403).send('팔로우하려는 사람이 없습니다.');
    }
    await user.addFollower(req.user.id); // 복수로 쓰면 무조건 된다. (하지만 단수가 말이 맞을 경우 테스트해 보기)
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 팔로잉 취소 */
// DELETE /user/1/follow
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } }); // userId가 들어 있는지 확인
    if (!user) {
      res.status(403).send('언팔로우하려는 사람이 없습니다.');
    }
    await user.removeFollower(req.user.id); // 복수로 쓰면 무조건 된다. (하지만 단수가 말이 맞을 경우 테스트해 보기)
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 팔로워 차단(취소) */
// DELETE /user/follower/1
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send('차단하려는 사람이 없습니다.');
    }
    await user.removeFollowing(req.user.id); //
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /user/followers
router.get('/followers', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // userId가 들어 있는지 확인
    if (!user) {
      res.status(403).send('없는 사람입니다.');
    }
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /user/followings
router.get('/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // userId가 들어 있는지 확인
    if (!user) {
      res.status(403).send('없는 사람입니다.');
    }
    const followings = await user.getFollowings(); // 복수로 쓰면 무조건 된다. (하지만 단수가 말이 맞을 경우 테스트해 보기)
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
