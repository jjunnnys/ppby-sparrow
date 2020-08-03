const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development'; // 기본 값을 development
const config = require('../config/config')[env]; // json 파일 가져온 것에 대해 env에 따라 파싱
const db = {};

// Sequelize가 node랑 mysql을 연결해준다.
// 연결 성공 시 sequelize 객체에 연결 정보가 들어 있음
const sequelize = new Sequelize(
  config.database,
  config.usename,
  config.password,
  config
);

/* 테이블 생성 */

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
