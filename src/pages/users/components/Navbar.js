import React, { useContext, useEffect, useState } from "react";
import "../css/style.css";
import { Link, useHistory } from "react-router-dom";
import logoWaysBucks from "../../../assets/img/logo-waysbucks.svg";
import logout from "../../../assets/img/logout.svg";
import user from "../../../assets/img/user.svg";
import cartIcon from "../../../assets/img/cart.svg";
import swal from "sweetalert";
import { UserContext } from "../../../context/userContext";
import { useQuery } from "react-query";
import { getCarts, getUser } from "../../../config/api";
import moment from "moment";
import { io } from "socket.io-client";

let socket;

const Navbar = () => {
  const history = useHistory();
  const [state, dispatch] = useContext(UserContext);
  let [messages, setMessages] = useState([]);
  const [notif, setNotif] = useState(false);

  const { data: carts } = useQuery("getCartsCache", getCarts);
  const { data: userId } = useQuery("getUserIdCache", getUser);

  // Connection Socket.io
  useEffect(() => {
    socket = io("http://localhost:3001", {
      auth: {
        token: localStorage.getItem("token"),
      },
      query: {
        id: state.user.id,
      },
    });

    socket.on("connect_error", (err) => {
      console.error(err.message);
    });

    socket.on("new message", () => {
      socket.emit("load messages", "63d12ca0-6604-465d-b2e9-aa5838fce441");
      setNotif(true);
    });

    console.log(notif);
    console.log(messages);

    loadContact();
    loadMessages();

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  // Load Contact
  const loadContact = () => {
    socket.emit("load admin contact");
    socket.on("admin contact", (data) => {
      // console.log(data)
      // const dataContact = {
      //     ...data,
      //     message: messages.length > 0 ? messages[messages.length - 1].message: 'Click here to start message'
      // }
      // setContacts([dataContact])
      socket.emit("load messages", data.id);
    });
  };

  // Load Message
  const loadMessages = () => {
    socket.on("messages", (data) => {
      if (messages.length !== data.length) {
        if (data.length > 0) {
          const dataMessages = data.map((item) => ({
            idSender: item.sender.id,
            message: item.message,
            createdAt: item.createdAt,
          }));
          setMessages(dataMessages);
          console.log(dataMessages);
        }
      }
    });
  };

  const handlerLogout = () => {
    swal({
      title: "Are you sure logout?",
      text: "You will be logged out of the user page",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((logout) => {
      if (logout) {
        dispatch({
          type: "LOGOUT",
        });
        localStorage.removeItem("token");
        history.push("/");
        window.location.reload();
      }
    });
  };

  const handlerNotification = () => {
    setNotif(false);
  };

  return (
    <>
      <nav className="fixed-top shadow-sm d-flex align-items-center">
        <div className="container-navbar d-flex justify-content-between align-items-center">
          <div className="logo-brand">
            <Link to="/">
              <img src={logoWaysBucks} alt="logo-waysbucks" />
            </Link>
          </div>
          <div className="navbar-link pe-2">
            <ul className="d-flex m-0 p-0 ps-5 justify-content-lg-around">
              <Link to="/contact" className="text-decoration-none ">
                <li className="fw-bolder">Contact</li>
              </Link>
              <div className="link-router text-decoration-none">
                <Link to="/all-menu" className="link-router text-decoration-none">
                  <li className="menu">
                    <p className="text-uppercase m-0 fw-bolder">All Menu</p>
                  </li>
                </Link>
              </div>
              <Link to="/about" className="link-router text-decoration-none">
                <li className="store">
                  <p className="text-uppercase m-0 fw-bolder">About</p>
                </li>
              </Link>
            </ul>
          </div>
          <div className="access d-flex">
            <div class="dropdown notification">
              <i class="fas fa-bell pe-4 pt-1" style={{ fontSize: "28px" }} data-bs-toggle="dropdown" onClick={handlerNotification}></i>
              <span className={notif === true ? `` : `d-none`}></span>
              <ul class="dropdown-menu dropdown-menu-notif dropdown-menu-dark">
                {messages.length === 0 ? (
                  <>
                    <li className="d-flex justify-content-center align-items-center no-notification" style={{ height: "200px", color: "#3d3d3d" }}>
                      {" "}
                      No Notification <i class="fas fa-bell-slash"></i>
                    </li>
                  </>
                ) : (
                  messages.slice(0, 4).map((data) => {
                    console.log(data);
                    return (
                      <>
                        <Link to="/profile" className="text-decoration-none">
                          <li className="d-flex mt-2 mb-2 list-notif">
                            <div class="image me-2">
                              <img src="/logo192.png" alt="admin" width="30px" />
                            </div>
                            <div class="message">
                              <div class="d-flex flex-column">
                                <p className="title-notif">Waysbucks-coffee</p>
                                <p className="m-0 text-date">{moment(data.createdAt).format("lll")}</p>
                              </div>
                              <p className="description-notif">{data.message}</p>
                            </div>
                          </li>
                        </Link>
                      </>
                    );
                  })
                )}
              </ul>
            </div>
            <div className="shop d-flex align-items-center">
              <Link to="/cart-page">
                <img src={cartIcon} alt="cart" className="me-4 image-cart" width="30px" />
                {carts?.length === 0 ? <></> : <span className="d-flex justify-content-center align-items-center">{carts?.length}</span>}
              </Link>
            </div>
            <div className="profile">
              <div class="dropdown">
                <img src={userId?.image} alt="profile" width="30px" className="img-profile" data-bs-toggle="dropdown" />
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <Link to="/profile" className="text-decoration-none">
                    <li className="sort-dropdown dropdown-profile d-flex">
                      <img src={user} alt="profile" />
                      <p className="m-0">Profile</p>
                    </li>
                  </Link>
                  <Link to="/wishlist" className="text-decoration-none">
                    <li className="sort-dropdown dropdown-profile brder d-flex">
                      <i class="far fa-heart"></i>
                      <p className="m-0">Wishlist</p>
                    </li>
                  </Link>
                  <li className="sort-dropdown dropdown-logout d-flex" onClick={handlerLogout}>
                    <img src={logout} alt="profile" />
                    <p className="m-0">Logout</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
