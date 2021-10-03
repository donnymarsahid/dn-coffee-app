import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ForgetPassword from "../../assets/modals/ForgetPassword";
import Login from "../../assets/modals/Login";
import Register from "../../assets/modals/Register";
import "./css/style.css";
import { useParams } from "react-router";
import { useMutation } from "react-query";
import { API } from "../../config/api";

const ResetPassword = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgetPass, setShowForgetPass] = useState(false);

  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => {
    setShowRegister(false);
    setShowForgetPass(false);
    setShowLogin(true);
  };

  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleCloseForgetPass = () => setShowForgetPass(false);
  const handleShowForgetPass = () => {
    setShowForgetPass(true);
    setShowLogin(false);
  };

  const { password, confirmPassword } = form;

  const handlerInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      if (password !== confirmPassword) {
        setMessage("password does match");
        setTimeout(() => {
          setMessage("");
        }, 3000);
        return false;
      }

      const dataPassword = JSON.stringify({ password: password });
      const config = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: dataPassword,
      };
      const response = await API().put("/reset-password/" + id, config);
    console.log(response);

      if (response.status === "success") {
        setMessage("Password changed successfully, please login");
      }
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <div>
      <title>Reset Password</title>
      <Navbar handleShowLogin={handleShowLogin} handleShowRegister={handleShowRegister} />
      <div className="page-reset-password d-flex justify-content-center align-items-center">
        <form onSubmit={(e) => handlerSubmit.mutate(e)}>
          {message && (
            <div class="alert alert-danger mb-1 p-2" role="alert">
              {message}
            </div>
          )}
          <label>New Password</label>
          <br />
          <input type="password" name="password" onChange={handlerInput} />
          <br />
          <label className="mt-3">Confirm New Password</label>
          <br />
          <input type="password" name="confirmPassword" onChange={handlerInput} />
          <br />
          <button type="submit">Reset Password</button>
        </form>
      </div>
      <Login showLogin={showLogin} handleCloseLogin={handleCloseLogin} handleShowRegister={handleShowRegister} handleShowForgetPass={handleShowForgetPass} />
      <Register showRegister={showRegister} handleCloseRegister={handleCloseRegister} handleShowLogin={handleShowLogin} />
      <ForgetPassword showForgetPass={showForgetPass} handleCloseForgetPass={handleCloseForgetPass} handleShowLogin={handleShowLogin} />
    </div>
  );
};

export default ResetPassword;
