import React from "react";
import "../css/style.css";
import { Link } from "react-router-dom";
import logoDNcoffee from "../../../assets/img/logo-waysbucks.svg";

const Navbar = ({ handleShowLogin, handleShowRegister }) => {
  return (
    <>
      <nav className="fixed-top shadow-sm d-flex align-items-center">
        <div className="container-navbar d-flex justify-content-between align-items-center">
          <div className="logo-brand">
            <Link to="/">
              <img src={logoDNcoffee} alt="logo-waysbucks" />
            </Link>
          </div>
          <div className="navbar-link guest">
            <ul className="d-flex m-0 p-0 ps-3 justify-content-lg-around">
              <Link to="/contact" className="text-decoration-none ">
                <li className="fw-bolder link-contact">Contact</li>
              </Link>
              <div className="text-decoration-none">
                <Link
                  to="/all-menu"
                  className="link-router text-decoration-none "
                >
                  <li className="menu link-allmenu">
                    <p className="text-uppercase m-0 fw-bolder">All Menu</p>
                  </li>
                </Link>
              </div>
              <Link to="/about" className="text-decoration-none ">
                <li className="store link-about">
                  <p className="text-uppercase m-0 fw-bolder">About</p>
                </li>
              </Link>
            </ul>
          </div>
          <div className="access">
            <button className="btn-login me-3" onClick={handleShowLogin}>
              Login
            </button>
            <button className="btn-register" onClick={handleShowRegister}>
              Register
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
