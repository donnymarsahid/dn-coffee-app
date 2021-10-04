const { order, transaction, user, toppingOrder, topping, product, cart } = require("../../models");
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

exports.addTransaction = async (req, res) => {
  try {
    const idUser = req.user.id;
    const { name, email, total, phone, posCode, address } = req.body;

    const addTransaction = await transaction.create({
      id: "wb-" + Math.random().toString().slice(3, 8),
      idUser,
      name,
      email,
      total,
      phone,
      posCode,
      address,
      status: "pending",
      attachment: null,
    });

    const buyerData = await user.findOne({
      where: {
        id: idUser,
      },
    });

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.SERVER_KEY_MIDTRANS,
    });

    const parameter = {
      transaction_details: {
        order_id: addTransaction.id,
        gross_amount: addTransaction.total,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: buyerData?.fullname,
        email: buyerData?.email,
        phone: buyerData?.phone,
      },
    };

    const payment = await snap.createTransaction(parameter);

    const findOrder = await order.findAll();
    findOrder.map(async (data) => {
      if (data.idTransaction === null) {
        const updateOrder = await order.update(
          { idTransaction: addTransaction.id },
          {
            where: {
              id: data.id,
              idTransaction: null,
            },
          }
        );
      }
    });

    const findCart = await cart.findAll();
    const getIdCart = findCart.map((data) => data.id);
    await cart.destroy({ where: { id: getIdCart } });

    res.status(200).send({
      status: "pending",
      message: "Transaction is proccess",
      payment,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
    });
    console.log(error);
  }
};

const CLIENT_KEY_MIDTRANS = process.env.CLIENT_KEY_MIDTRANS;
const SERVER_KEY_MIDTRANS = process.env.SERVER_KEY_MIDTRANS;

const core = new midtransClient.CoreApi();

core.apiConfig.set({
  isProduction: false,
  serverKey: SERVER_KEY_MIDTRANS,
  clientKey: CLIENT_KEY_MIDTRANS,
});

const handleTransaction = async (status, transactionId) => {
  await transaction.update(
    {
      status,
    },
    {
      where: {
        id: transactionId,
      },
    }
  );
};

exports.notification = async (req, res) => {
  try {
    const statusResponse = await core.transaction.notification(req.body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        handleTransaction("pending", orderId);
        res.status(200);
      } else if (fraudStatus == "accept") {
        const findOrder = await order.findAll();
        findOrder.map(async (data) => {
          if (data.idTransaction === null) {
            await order.update(
              { idTransaction: orderId },
              {
                where: {
                  id: data.id,
                  idTransaction: null,
                },
              }
            );
          }
        });

        const findCart = await cart.findAll();
        const getIdCart = findCart.map((data) => data.id);
        await cart.destroy({ where: { id: getIdCart } });

        handleTransaction("waiting approve", orderId);
        res.status(200);
      }
    } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
      handleTransaction("failed", orderId);
      res.status(200);
    } else if (transactionStatus == "pending") {
      handleTransaction("pending", orderId);
      res.status(200);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};
