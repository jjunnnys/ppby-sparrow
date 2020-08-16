module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      // 이모티콘을 넣고 싶을 땐
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 이모티콘도 저장
    }
  );
  Post.associate = (db) => {
    // Post는 User에 속해 있다.
    db.Post.belongsTo(db.User); // belongsTo 는 모델과의 관계를 위해 컬럼을 생성한다.(UserId,PostId) // post.addUser, (get은 includ 과정에서 가져온다.), post.setUser(수정)
    // 1:N
    db.Post.hasMany(db.Comment); // post.addComments
    db.Post.hasMany(db.Image); // 관계형 메서드가 생김 -> 시퀄라이즈에서 만들어 준다. // post.addImages
    // N:M
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // 게시글과 좋아요 관계 (반대 쪽에서도 똑같이 작성, 안 하면 두개의 테이블 명을 합친다.) // post.addLikers, post.removeLikers
    // 좋아요를 누른 사람, as 로 별칭을 붙힌다.
    // 리트윗 기능
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
  };

  return Post;
};
