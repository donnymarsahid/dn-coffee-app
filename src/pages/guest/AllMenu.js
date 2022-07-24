import React, { useState } from "react";
import Login from "../../assets/modals/Login";
import Register from "../../assets/modals/Register";
import CardAllCoffee from "./cardsProducts/CardAllCoffee";
import CardCoffee from "./cardsProducts/CardCoffe";
import "./css/style.css";
import { useQuery } from "react-query";
import { getProducts, getTypeCoffee } from "../../config/api";
import loading from "../../assets/img/loading.gif";
import ModalNotAvailable from "./components/ModalNotAvailable";
import Navbar from "./components/Navbar";
import ForgetPassword from "../../assets/modals/ForgetPassword";

const AllMenu = () => {
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

  const {
    data: products,
    isLoading,
    error,
  } = useQuery("productsCache", getProducts);
  const {
    data: typeCoffee,
    isLoading: loadTypeCoffee,
    error: errorTypeCoffee,
  } = useQuery("typeCoffeeCache", getTypeCoffee);
  const [renderCoffee, setRenderCoffee] = useState(true);
  const [title, setTitle] = useState("All Menu");

  if (isLoading || loadTypeCoffee) {
    return (
      <div className="custom-status">
        <img src={loading} alt="load" width="100px" />
      </div>
    );
  }

  if (error) return <div className="custom-status">Error fetching data</div>;

  return (
    <>
      <title>DNcoffee | All Menu</title>
      <Navbar
        handleShowLogin={handleShowLogin}
        handleShowRegister={handleShowRegister}
      />
      <section className="all-menu varian">
        <div className="container">
          <div class="title d-flex justify-content-between mb-3">
            <h3>{title}</h3>
            <div class="dropdown">
              <button
                class="btn-sort-by dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Sort By
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <div
                    class="dropdown-item"
                    onClick={() => {
                      setTitle("All Menu");
                      setRenderCoffee(true);
                    }}
                  >
                    All Menu
                  </div>
                </li>
                <li>
                  <div
                    class="dropdown-item"
                    onClick={() => {
                      setTitle("Coffee Variant");
                      setRenderCoffee(false);
                    }}
                  >
                    Coffee Variant
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            {renderCoffee
              ? products?.map((data) => (
                  <CardAllCoffee
                    coffee={data}
                    key={data.id}
                    handleShowLogin={handleShowLogin}
                  />
                ))
              : typeCoffee?.map((data) => (
                  <CardCoffee
                    coffee={data}
                    key={data.id}
                    handleShowLogin={handleShowLogin}
                  />
                ))}
          </div>
        </div>
      </section>
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
      <ModalNotAvailable />
    </>
  );
};

export default AllMenu;
