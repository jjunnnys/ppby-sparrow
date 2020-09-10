module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'Image',
    {
      src: {
        type: DataTypes.STRING(200), // url이라서 엄청 길어 질 수 있다.
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };

  return Image;
};
