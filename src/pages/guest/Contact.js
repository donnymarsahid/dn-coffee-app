import React, { useState } from "react";
import ForgetPassword from "../../assets/modals/ForgetPassword";
import Login from "../../assets/modals/Login";
import Register from "../../assets/modals/Register";
import Navbar from "./components/Navbar";

const Contact = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgetPass, setShowForgetPass] = useState(false);

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
  return (
    <>
      <title>WaysBucks | Contact</title>
      <Navbar
        handleShowLogin={handleShowLogin}
        handleShowRegister={handleShowRegister}
      />
      <div class="page-contact d-flex align-items-center justify-content-center flex-column">
        <h3>Any Question ?</h3>
        <p>Contact us via</p>
        <div class="email d-flex flex-column border-lg">
          <i class="fas fa-envelope text-center"></i>
          <a href="mailto:waysbucks.coffee@gmail.com" class="ms-2">
            waysbucks.coffee@gmail.com
          </a>
        </div>
        <div class="telp d-flex flex-column border-lg">
          <i class="fab fa-whatsapp text-center"></i>
          <a
            href="https://api.whatsapp.com/send?phone=6283872239021&text=Hallo%20Donny"
            class="ms-2"
            target="blank"
          >
            Click Here!
          </a>
        </div>
      </div>
      <Login
        showLogin={showLogin}
        handleCloseLogin={handleCloseLogin}
        handleShowRegister={handleShowRegister}
        handleShowForgetPass={handleShowForgetPass}
      />
      <Register
        showRegister={showRegister}
        handleCloseRegister={handleCloseRegister}
        handleShowLogin={handleShowLogin}
      />
      <ForgetPassword
        showForgetPass={showForgetPass}
        handleCloseForgetPass={handleCloseForgetPass}
        handleShowLogin={handleShowLogin}
      />
    </>
  );
};

export default Contact;
