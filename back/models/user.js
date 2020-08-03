module.exports = (sequelize, DataTypes) => {
  // 사용자 정보를 저장
  const User = sequelize.define(
    'User', // 자동으로 MySQL에는 'User'가 'users' 로 테이블 생성 -> as
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
  User.associate = (db) => {
    /* 
      1:1 예시 -> User 와 UserInfo가 있을 경우
      - db.User.hasOne(db.UserInfo);
      - db.UserInfo.belongsTo(db.User); -> belongsTo 가 들어 가는 곳에 OOOId 가 생긴다.
    */
    // 1:N
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    // N:M
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Likers' }); // 게시글과 좋아요 관계, 중간 테이블명을 정해 줄 수 있음 {through: 'Like'}
    // as 로 별칭을 붙힌다.
    // 나중에 as에 따라서 post.getLikers 처럼 게시글 좋아요 누른 사람을 가져오게 된다. (포스트에 좋아요를 누른 사람들)
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers',
      foreignkey: 'FollowingId', // 반대로 생각, 나의 팔로워를 찾기 위해선 팔로잉 목록에서 나를 찾고 거기에서 팔로워를 찾는다.
    });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignkey: 'FollowerId', // foreignkey 를 통해 (UserId 가 곂치는 상황) 새로운 id를 등록
    });
  };

  return User;
};
