const express = require('express');
const cors = require('cors');

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
app.use(express.json()); // json 형태로 req.body에 담는다.
app.use(express.urlencoded({ extended: true })); // form submit 데이터를 처리

app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/post', postRouter); // 중복되는 '/post' 를 뽑아 줬음 (prefix:접두사)
app.use('/user', userRouter);

app.listen(3065, () => {
  console.log('서버 실행 중');
});
