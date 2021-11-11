module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define("brand", {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    subtitle: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    icon: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
  return Brand;
};
