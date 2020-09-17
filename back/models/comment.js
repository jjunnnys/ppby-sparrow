// 클래스 문법
const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {
  static init(sequelize) {
    // sequelize.define === Model.init 이랑 같다
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelNmae: 'Comment',
        tableName: 'comments', // 자동으로 소문자 복수로 만든다.
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        sequelize, // 연결 객체를 다시 넣어 줌
      }
    );
  }

  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  }
};

// (sequelize, DataTypes) => {
//   const Comment = sequelize.define(
//     'Comment',
//     {
//       content: {
//         type: DataTypes.TEXT, // 글자 길이 제한 없음
//         allowNull: false,
//       },
//     },
//     {
//       charset: 'utf8mb4',
//       collate: 'utf8mb4_general_ci',
//     }
//   );
//   Comment.associate = (db) => {
//     // Comment는 User에 속해 있다.
//     db.Comment.belongsTo(db.User);
//   };

//   return Comment;
// };
