"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class wishlist extends Model {
    static associate(models) {
      wishlist.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });
      wishlist.belongsTo(models.product, {
        as: "product",
        foreignKey: {
          name: "idProduct",
        },
      });
    }
  }
  wishlist.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      idProduct: DataTypes.INTEGER,
      idUser: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "wishlist",
    }
  );
  return wishlist;
};
