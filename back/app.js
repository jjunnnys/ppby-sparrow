const express = require('express');

const app = express();

/* 
  - restAPI 방식 -> 정확히 지키기는 불가능 (팀원끼리 타협을 봐야함)
  - swagger 라는 툴을 사용하여 API 문서를 뽑는다.

  get -> 가져오다
  post -> 생성하다 (애매하면 그냥 post 쓰기)
  put -> 전체 수정
  delete -> 제거
  patch -> 부분 수정
  options -> 찔러보기 (ex. '나 요청 보낼 수 있어??' 이 정도로 이해)
  head -> 헤더만 가져오기(헤더/바디)
*/

app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/api', (req, res) => {
  res.send('hello api');
});

app.get('/api/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' },
    { id: 3, content: 'hello3' },
  ]);
});

app.post('/api/posts', (req, res) => {
  res.json({ id: 4, content: 'hello4' });
});

app.delete('/api/posts', (req, res) => {
  res.json({ id: 1 });
});

app.listen(3065, () => {
  console.log('서버 실행 중');
});
