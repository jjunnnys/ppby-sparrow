module.exports = (sequelize, DataTypes) => {
  // 사용자 정보를 저장
  const User = sequelize.define(
    'User', // 자동으로 MySQL에는 'User'가 'users' 로 테이블 생성
    {
      // id:{} -> MySQL에서 자동으로 넣어 준다.
      email: {
        // 많이 쓰이는 type -> STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
        type: DataTypes.STRING(30),
        allowNull: false, // 필수 입력
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수 입력
      },
      password: {
        type: DataTypes.STRING(100), // 암호화가 되면 길이가 길어짐
        allowNull: false, // 필수 입력
      },
    },
    {
      // User 모델에 대한 세팅
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
    }
  );
  User.associate = (db) => {};

  return User;
};
