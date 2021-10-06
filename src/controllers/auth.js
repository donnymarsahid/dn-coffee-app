const { user } = require("../../models");
require("dotenv").config();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMailFunction = require("../sendEmail/sendEmail");
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res) => {
  const schema = Joi.object({
    fullname: Joi.string().min(6).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(8).required(),
  });
  const { error } = schema.validate(req.body);
  const emailExists = await user.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (emailExists) {
    res.status(500).send({
      status: "failed",
      message: "email already exists",
    });
    return false;
  }
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const saltRounds = await bcrypt.genSalt(10);
    const hashingPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = await user.create({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashingPassword,
      status: "user",
      image: "http://localhost:3001/images/profile.png",
    });
    const token = jwt.sign({ id: newUser.id, status: newUser.status }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).send({
      status: "success",
      data: {
        user: {
          fullname: newUser.fullname,
          email: newUser.email,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(8).required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    const isValid = await bcrypt.compare(req.body.password, userExist.password);
    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "email/password incorrect",
      });
    }
    const token = jwt.sign({ id: userExist.id, status: userExist.status }, process.env.JWT_SECRET);
    res.status(200).send({
      status: "success",
      data: {
        user: {
          fullname: userExist.fullname,
          email: userExist.email,
          token,
          status: userExist.status,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "email/password incorrect",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;
    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.name,
          email: dataUser.email,
          status: dataUser.status,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Forget Password
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const thisUser = await user.findOne({
      where: {
        email,
      },
    });

    if (thisUser) {
      const id = uuidv4();
      await user.update(
        { resetLink: id },
        {
          where: {
            email,
          },
        }
      );
      const link = `https://7238-180-243-2-155.ngrok.io/reset-password/${id}`;
      await sendMailFunction.sendResetLink(thisUser.email, "Reset Password Instructions", link, thisUser.fullname);
    } else {
      res.status(500).send({
        status: "failed",
        message: "email is not registered",
      });
    }

    res.status(200).send({
      status: "success",
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
    });
    console.log(error);
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const saltRounds = await bcrypt.genSalt(10);
    const hashingPassword = await bcrypt.hash(password, saltRounds);

    await user.update(
      { password: hashingPassword },
      {
        where: {
          resetLink: id,
        },
      }
    );

    res.status(200).send({
      status: "success",
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
    });
    console.log(error);
  }
};
