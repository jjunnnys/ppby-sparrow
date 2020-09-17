const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Hashtag extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
      },
      {
        modelNmae: 'Hashtag',
        tableName: 'hashtags',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        sequelize, // 연결 객체를 다시 넣어 줌
      }
    );
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Hashtag = sequelize.define(
//     'Hashtag',
//     {
//       name: {
//         type: DataTypes.STRING(20),
//         allowNull: false,
//       },
//     },
//     {
//       charset: 'utf8mb4',
//       collate: 'utf8mb4_general_ci',
//     }
//   );
//   Hashtag.associate = (db) => {
//     // N:M
//     db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
//   };

//   return Hashtag;
// };
