"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasMany(models.transaction, {
        as: "transactions",
        foreignKey: {
          name: "idUser",
        },
      });
      user.hasMany(models.cart, {
        as: "carts",
        foreignKey: {
          name: "idUser",
        },
      });
      user.hasMany(models.topping, {
        as: "toppings",
        foreignKey: {
          name: "idUser",
        },
      });
      user.hasMany(models.product, {
        as: "products",
        foreignKey: {
          name: "idUser",
        },
      });
      user.hasMany(models.wishlist, {
        as: "wishlists",
        foreignKey: {
          name: "idUser",
        },
      });
      user.hasMany(models.chat, {
        as: "senderMessage",
        foreignKey: {
          name: "idSender",
        },
      });
      user.hasMany(models.chat, {
        as: "recipientMessage",
        foreignKey: {
          name: "idRecipient",
        },
      });
    }
  }
  user.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
      phone: DataTypes.STRING,
      posCode: DataTypes.STRING,
      address: DataTypes.STRING,
      status: DataTypes.STRING,
      resetLink: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
