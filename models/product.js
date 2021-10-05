"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    static associate(models) {
      product.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });
      product.hasMany(models.cart, {
        as: "carts",
        foreignKey: {
          name: "idProduct",
        },
      });
      product.hasMany(models.wishlist, {
        as: "wishlists",
        foreignKey: {
          name: "idProduct",
        },
      });
      product.hasMany(models.order, {
        as: "orders",
        foreignKey: {
          name: "idProduct",
        },
      });
    }
  }
  product.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: DataTypes.STRING,
      price: DataTypes.INTEGER,
      image: DataTypes.STRING,
      typeCoffee: DataTypes.STRING,
      status: DataTypes.STRING,
      idUser: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
