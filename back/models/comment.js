module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      content: {
        type: DataTypes.TEXT, // 글자 길이 제한 없음
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    }
  );
  Comment.associate = (db) => {
    // Comment는 User에 속해 있다.
    db.Comment.belongsTo(db.User);
  };

  return Comment;
};
