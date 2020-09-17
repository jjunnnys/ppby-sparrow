const Sequelize = require('sequelize');

const comment = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');

const env = process.env.NODE_ENV || 'development'; // 기본 값을 development
const config = require('../config/config')[env]; // json 파일 가져온 것에 대해 env에 따라 파싱
const db = {};

/*
  - 모델 마다 (또는 모델 안에서) 서로 관계가 있을 떈 associate에 작성
    -> 독립적으로 모델을 만들고 서로 어떤 관계가 있는지 파악
  - 서버 실행하기 전 데이터베이스 만들기, $ npx sequelize db:create
*/

// Sequelize가 node랑 mysql을 연결해준다.
// 연결 성공 시 sequelize 객체에 연결 정보가 들어 있음
const sequelize = new Sequelize(
  config.database,
  config.usename,
  config.password,
  config
);

/* 테이블 생성 - 모델은 단수로 작성, (테이블을 모델이라고 부름) */
db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

// 반복문 돌면서 모델에 있는 associate 부분을 실행해 줌
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
