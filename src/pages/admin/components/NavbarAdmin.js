import React, { useContext } from 'react';
import '../css/style.css';
import { Link, useHistory } from 'react-router-dom';
import logoDNcoffee from '../../../assets/img/logo-waysbucks.svg';
import swal from 'sweetalert';
import logout from '../../../assets/img/logout.svg';
import { UserContext } from '../../../context/userContext';
import user from '../../../assets/img/user.svg';

const NavbarAdmin = () => {
  const [state, dispatch] = useContext(UserContext);
  const history = useHistory();

  const handlerLogout = () => {
    swal({
      title: 'Are you sure logout?',
      text: 'You will be logged out of the user page',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((logout) => {
      if (logout) {
        dispatch({
          type: 'LOGOUT',
        });
        localStorage.removeItem('token');
        history.push('/');
        window.location.reload();
      }
    });
  };

  return (
    <>
      <nav className="fixed-top shadow-sm d-flex align-items-center">
        <div className="container-navbar d-flex justify-content-between align-items-center">
          <div className="logo-brand">
            <Link to="/admin">
              <img src={logoDNcoffee} alt="logo-waysbucks" />
            </Link>
          </div>
          <div className="access d-flex">
            <div className="profile">
              <div className="btn-group dropstart">
                <p className="m-0 pe-2 text-nav-admin">Hai Admin!</p>
                <div class="dropdown">
                  <img src="/logo192.png" alt="profile" width="30px" className="img-profile" data-bs-toggle="dropdown" />
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <Link to="/admin" className="text-decoration-none">
                      <li className="sort-dropdown  dropdown-profile d-flex">
                        <img src={user} alt="profile" />
                        <p className="m-0">Admin</p>
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
        </div>
      </nav>
    </>
  );
};

export default NavbarAdmin;
