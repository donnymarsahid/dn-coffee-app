import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useMutation } from "react-query";
import { API } from "../../config/api";
import "./style.css";

const ForgetPassword = ({
  showForgetPass,
  handleCloseForgetPass,
  handleShowLogin,
}) => {
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    email: "",
  });

  const { email } = form;

  const handlerInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const body = JSON.stringify(form);
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      };

      const response = await API().post("/forget-password", config);

      if (response.status === "failed") {
        setMessage(response.message);
        setTimeout(() => {
          setMessage("");
        }, 3000);
        return false;
      }

      setMessage("Check your email for reset password");
      setTimeout(() => {
        setMessage("");
      }, 3000);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <Modal show={showForgetPass} onHide={handleCloseForgetPass} centered>
      <Modal.Header className="d-flex justify-content-between">
        <div />
        <i className="fas fa-times" onClick={handleCloseForgetPass}></i>
      </Modal.Header>
      <Modal.Body className="modal-body">
        {message && (
          <div class="alert alert-login alert-danger" role="alert">
            {message}
          </div>
        )}
        <div className="access-login-register d-flex justify-content-center align-items-center">
          <div className="box-access">
            <form onSubmit={(e) => handlerSubmit.mutate(e)}>
              <input
                type="email"
                name="email"
                id="email"
                placeHolder="Enter your email"
                className="mt-3 mb-3"
                autoComplete="off"
                onChange={handlerInput}
                required
              />

              <br />
              <button type="submit">Get link reset</button>
            </form>
            <p className="text-center mt-3 d-flex justify-content-center">
              Back to login ? click
              <p
                className="ps-1 click m-0 text-decoration-underline"
                onClick={handleShowLogin}
              >
                here
              </p>
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ForgetPassword;
