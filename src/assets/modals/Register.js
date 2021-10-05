import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { useMutation } from "react-query";
import { API } from "../../config/api";
import { UserContext } from "../../context/userContext";
import "./style.css";

const Register = ({ showRegister, handleCloseRegister, handleShowLogin }) => {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { fullname, email, password, confirmPassword } = form;

  const handlerInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setMessage("password does not match");
        setTimeout(() => {
          setMessage("");
        }, 3000);
        return false;
      }
      const body = JSON.stringify({ fullname, email, password });
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      };
      const response = await API().post("/register", config);
      if (response.status === "failed") {
        setMessage(response.message);
        setTimeout(() => {
          setMessage("");
        }, 3000);
        return false;
      }
      setMessage("success register please login");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal show={showRegister} onHide={handleCloseRegister} centered>
      <Modal.Header className="d-flex justify-content-between">
        <div />
        <i className="fas fa-times" onClick={handleCloseRegister}></i>
      </Modal.Header>
      <Modal.Body className="modal-body register">
        <div className="access-login-register d-flex justify-content-center align-items-center">
          <div className="box-access">
            <h2>Register</h2>
            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}
            <form onSubmit={handlerSubmit}>
              <input type="text" name="fullname" id="fullname" placeHolder="Full Name" className="mt-3 mb-3" onChange={handlerInput} autoComplete="off" required />
              <br />
              <input type="email" name="email" id="email" placeHolder="Email" className="mt-2 mb-3" onChange={handlerInput} autoComplete="off" required />
              <br />
              <div className="box-pass d-flex">
                <input
                  type={showPassword ? `text` : `password`}
                  name="password"
                  id="password"
                  placeHolder="Password"
                  className="input-password"
                  autoComplete="off"
                  required
                  onChange={handlerInput}
                />
                <div className="show-hide-pass d-flex align-items-center justify-content-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <i class="fas fa-eye"></i> : <i class="fas fa-eye-slash"></i>}
                </div>
              </div>
              <br />
              <div className="box-pass d-flex">
                <input
                  type={showPasswordConfirm ? `text` : `password`}
                  name="confirmPassword"
                  id="confrim-password"
                  placeHolder="Confirm Password"
                  className="input-password"
                  autoComplete="off"
                  required
                  onChange={handlerInput}
                />
                <div className="show-hide-pass d-flex align-items-center justify-content-center" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                  {showPasswordConfirm ? <i class="fas fa-eye"></i> : <i class="fas fa-eye-slash"></i>}
                </div>
              </div>

              <br />
              <button type="submit">Register</button>
            </form>
            <p className="text-center mt-3 d-flex justify-content-center">
              Already have an account ? click
              <p className="ps-1 click m-0 text-decoration-underline" onClick={handleShowLogin} style={{ cursor: "pointer" }}>
                here
              </p>
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Register;
