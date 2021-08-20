import React, { useEffect } from 'react';
import '../css/style.css';
import { Link, useHistory } from 'react-router-dom';
import logoWaysBucks from '../../assets/img/logo-waysbucks.svg';
import swal from 'sweetalert';
import { useState } from 'react/cjs/react.development';

const Navbar = () => {
  const history = useHistory();
  const [totalCart, setTotalCart] = useState(0);

  const handlerLogout = () => {
    swal({
      title: 'Are you sure logout?',
      text: 'You will be logged out of the user page',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((logout) => {
      if (logout) {
        localStorage.setItem('login_auth', false);
        localStorage.clear('coffee_variant');
        localStorage.clear('coffee_all');
        localStorage.clear('user_transaction');
        history.push('/');
        window.location.reload();
      }
    });
  };
  const cart = JSON.parse(localStorage.getItem('user_transaction'));
  useEffect(() => {
    setTotalCart(cart.order.length);
  }, [cart]);
  return (
    <>
      <nav className="fixed-top shadow-sm d-flex align-items-center">
        <div className="container-navbar d-flex justify-content-between align-items-center">
          <div className="logo-brand">
            <Link to="/">
              <img src={logoWaysBucks} alt="logo-waysbucks" />
            </Link>
          </div>
          <div className="navbar-link">
            <ul className="d-flex m-0 p-0 ps-4 justify-content-lg-around">
              <Link to="/" className="text-decoration-none">
                <li>Homepage</li>
              </Link>
              <Link to="/coffee" className="text-decoration-none">
                <li>Coffee</li>
              </Link>
              <Link to="/all-menu" className="link-router text-decoration-none">
                <li className="menu">
                  <p className="text-uppercase m-0">Menu</p>
                  <div className="box">
                    <p className="pb-3 m-0">All Menu</p>
                  </div>
                </li>
              </Link>
              <Link to="/" className="link-router text-decoration-none">
                <li className="store">
                  <p className="text-uppercase m-0">Store</p>
                  <div className="box">
                    <p className="pb-3 m-0">Location</p>
                  </div>
                </li>
              </Link>
            </ul>
          </div>
          <div className="access d-flex">
            <div className="shop d-flex align-items-center">
              <p className="fw-bold m-0">({totalCart})</p>
              <i className="fas fa-shopping-basket ms-1 me-4"></i>
            </div>
            <div className="profile">
              <i className="fas fa-user-circle avatar"></i>
              <div className="dropdown">
                <Link to="/" className="text-decoration-none">
                  Profile
                </Link>
                <hr />
                <button onClick={handlerLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
