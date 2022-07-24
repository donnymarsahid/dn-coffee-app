import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
import { API } from "../../config/api";
import { UserContext } from "../../context/userContext";
import "./style.css";

const Login = ({ showLogin, handleCloseLogin, handleShowRegister, handleShowForgetPass }) => {
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handlerInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerSubmit = useMutation(async (e) => {
    e.preventDefault();
    try {
      const body = JSON.stringify(form);
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      };
      const response = await API().post("/login", config);

      if (response.status === "success") {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.user,
        });
        if (response.data.user.status === "admin") {
          // history.push("/admin");
          window.location.reload();
        } else {
          history.push("/");
          window.location.reload();
        }
      } else {
        setMessage(response.message);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <Modal show={showLogin} onHide={handleCloseLogin} centered>
      <Modal.Header className="d-flex justify-content-between">
        <div />
        <i className="fas fa-times" onClick={handleCloseLogin}></i>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <div className="access-login-register d-flex justify-content-center align-items-center">
          <div className="box-access">
            <h2>Login</h2>
            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}
            <form onSubmit={(e) => handlerSubmit.mutate(e)}>
              <input type="email" name="email" id="email" placeHolder="Email" className="mt-3 mb-3" autoComplete="off" required onChange={handlerInput} />
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
              <button type="submit mt-4">Login</button>
            </form>
            <p className="text-center mt-3 d-flex justify-content-center">
              Don't have an account ? click
              <p className="ps-1 click m-0 text-decoration-underline" style={{ cursor: "pointer" }} onClick={handleShowRegister}>
                here
              </p>
            </p>
            <p className="text-center mt-3 d-flex justify-content-center text-forget-pass" onClick={handleShowForgetPass}>
              Forget Password?
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
