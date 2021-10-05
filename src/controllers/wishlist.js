const { wishlist, user, product } = require("../../models");

// Get all data wishlist from idUser
exports.getWishlistUser = async (req, res) => {
  try {
    const wishlistUser = await wishlist.findAll({
      order: [["createdAt", "DESC"]],
      where: {
        idUser: req.user.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: product,
          as: "product",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({
      status: "success",
      data: wishlistUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

// Add wishlist from idUser
exports.addWishlist = async (req, res) => {
  try {
    const idUser = req.user.id;
    const idProduct = req.params.id;

    await wishlist.create({ idUser, idProduct });

    res.status(200).send({
      status: "success",
      idUser,
      idProduct,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

// Delete wishlist from idUser with idProduct
exports.deleteWishlist = async (req, res) => {
  try {
    const idProduct = req.params.id;
    const idUser = req.user.id;

    await wishlist.destroy({
      where: {
        idUser,
        idProduct,
      },
    });

    res.status(200).send({
      status: "success",
      idProduct,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
