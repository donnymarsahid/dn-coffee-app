const {
  order,
  transaction,
  user,
  toppingOrder,
  topping,
  product,
  cart,
} = require("../../models");

const { v4: uuidv4 } = require("uuid");

const midtransClient = require("midtrans-client");

exports.getTransaction = async (req, res) => {
  try {
    const transactionUser = await transaction.findAll({
      order: [["updatedAt", "DESC"]],
      where: {
        idUser: req.user.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: order,
          as: "orders",
          attributes: {
            exclude: ["createdAt"],
          },
          include: [
            {
              model: product,
              as: "product",
              attributes: {
                exclude: ["createdAt"],
              },
            },
            {
              model: topping,
              as: "toppings",
              through: {
                model: toppingOrder,
                as: "junction",
                attributes: [],
              },
            },
          ],
        },
      ],
    });
    res.status(200).send({
      status: "success",
      data: transactionUser,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
    });
    console.log(error);
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const idUser = req.user.id;
    const { name, email, total, phone, posCode, address } = req.body;

    const newData = await transaction.create({
      idUser,
      name,
      email,
      total,
      phone,
      posCode,
      address,
      attachment: "null",
      status: "pending",
    });

    res.status(200).send({
      status: "pending",
      message: "Transaction status pending payment gateway zz",
      email,
      total,
    });

    // const file = process.env.IMG_URL;
    // const uploadFile = file + req.file.filename;
    // const { name, email, total, phone, posCode, address } = req.body;

    // const addTransaction = await transaction.create({
    //   idUser,
    //   name,
    //   email,
    //   total,
    //   phone,
    //   posCode,
    //   address,
    //   status: "waiting approve",
    //   attachment: uploadFile,
    // });

    // const findOrder = await order.findAll();
    // findOrder.map(async (data) => {
    //   if (data.idTransaction === null) {
    //     const updateOrder = await order.update(
    //       { idTransaction: addTransaction.id },
    //       {
    //         where: {
    //           id: data.id,
    //           idTransaction: null,
    //         },
    //       }
    //     );
    //   }
    // });

    // const findCart = await cart.findAll();
    // const getIdCart = findCart.map((data) => data.id);
    // await cart.destroy({ where: { id: getIdCart } });

    // res.status(200).send({
    //   status: "success",
    //   id: addTransaction,
    // });
  } catch (error) {
    res.status(500).send({
      status: "failed",
    });
    console.log(error);
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await transaction.findAll({
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: order,
          as: "orders",
          attributes: {
            exclude: ["createdAt"],
          },
          include: [
            {
              model: product,
              as: "product",
              attributes: {
                exclude: ["createdAt"],
              },
            },
            {
              model: topping,
              as: "toppings",
              through: {
                model: toppingOrder,
                as: "junction",
                attributes: [],
              },
            },
          ],
        },
      ],
    });

    res.status(200).send({
      status: "success",
      data: transactions,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
    });
    console.log(error);
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const idTransaction = req.params.id;
    const deleteTransaction = await transaction.destroy({
      where: {
        id: idTransaction,
      },
    });

    res.status(200).send({
      status: "success",
      id: idTransaction,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
    });
    console.log(error);
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const idTransaction = req.params.id;
    const status = req.body.status;
    await transaction.update(
      { status },
      {
        where: {
          id: idTransaction,
        },
      }
    );

    res.send({
      status: "success",
      data: {
        status,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getDetailTransaction = async (req, res) => {
  try {
    const detailTransaction = await transaction.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: order,
          as: "orders",
          attributes: {
            exclude: ["createdAt"],
          },
          include: [
            {
              model: product,
              as: "product",
              attributes: {
                exclude: ["createdAt"],
              },
            },
            {
              model: topping,
              as: "toppings",
              through: {
                model: toppingOrder,
                as: "junction",
                attributes: [],
              },
            },
          ],
        },
      ],
    });
    res.status(200).send({
      status: "success",
      data: detailTransaction,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
    });
    console.log(error);
  }
};

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: "SB-Mid-server-naYsbU46CdrttRgBYgEfICvg",
  clientKey: "SB-Mid-client-VgmmM4o8ZbcepO2E",
});

exports.notification = async (req, res) => {
  try {
    const statusResponse = await core.transaction.notification(req.body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_id;
    const fraudStatus = statusResponse.fraud_status;

    console.log(statusResponse);
  } catch (error) {
    res.status(500).send({
      status: "failed",
    });
    console.log(error);
  }
};
