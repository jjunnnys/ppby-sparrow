const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');

const app = express();

/* 
  - restAPI 방식 -> 정확히 지키기는 불가능 (팀원끼리 타협을 봐야함)
  - swagger 라는 툴을 사용하여 API 문서를 뽑는다.
  - !!하나의 요청엔 하나의 응답
  - 시퀄라이즈 세팅 $ npx sequelize init
  - 스케일업 할 경우 서버를 쪼개서 두는게 좋다.
  - acation.data(프론트엔드) === req.body(백엔드)

  get -> 가져오다
  post -> 생성하다 (애매하면 그냥 post 쓰기)
  put -> 전체 수정
  delete -> 제거
  patch -> 부분 수정
  options -> 찔러보기 (ex. '나 요청 보낼 수 있어??' 이 정도로 이해)
  head -> 헤더만 가져오기(헤더/바디)
*/

dotenv.config();

// (프로미스) 서버 실핼 할 때 시퀄라이즈 연결도 같이 된다.
db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

passportConfig();

// 상위에 적어야한다. 미들웨어 특성 상 요청한 데이터를 위에서 아래로 시작이 된다.
app.use(
  // 실무에서는 요청을 보내는 도메인을 적어 줌
  cors({
    origin: true, // true 설정 시, * 대신 보낸 곳의 주소가 자동으로 들어가 편하다.
  })
);
// 프론트에서 받아 온 데이터를 req.body어 넣기 위한 작업
/* 
  쿠키 : 랜덤한 문자열을 브라우저로 보내준다.
  세션 : 서버쪽에서 테이터를 통째로 들고 있는 것

  - 백엔드 서버 쪽에서는 메모리를 아끼기 위해 쿠키에 사용자 정보를 다 매칭시키지 않고 id만 매칭
  - 세션 저장용 DB로 redis를 사용
*/
app.use(express.json()); // json 형태로 req.body에 담는다.
app.use(express.urlencoded({ extended: true })); // form submit 데이터를 처리

// 쿠키랑 세션이 필요한 이유는 브라우저랑 서버가 같은 정보를 들고 있어야 한다.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false, // saveUninitialized, resave 는 거의 false 사용
    resave: false,
    /*
    쿠키에 랜덤한 문자열을 보내 주는데 이건 이 서비스의 데이터에 기반하여 만들어진 문자열
    이 secret 이 해킹 당하면 데이터가 노출될 수 있다.
    (secret 키를 알면 데이터를 복원 할 수 있다.)
    보안에 위협이 될 수 있기 때문에 scret 키는 숨겨놔야 한다.
    .env 로 관리
  */
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/post', postRouter); // 중복되는 '/post' 를 뽑아 줬음 (prefix:접두사)
app.use('/user', userRouter);

app.listen(3065, () => {
  console.log('서버 실행 중');
});
