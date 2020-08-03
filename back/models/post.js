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
  Post.associate = (db) => {};

  return Post;
};
