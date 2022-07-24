import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <footer className="d-flex align-items-center">
        <div className="container-footer">
          <div className="row">
            <div className="col-md-4 call">
              <p>CONTACT ME</p>
              <p>
                <a href="/">
                  Hub : 0838-7223-9021 <br />
                </a>
                <a href="/">Email : dn.coffee@gmail.com</a>
              </p>
            </div>
            <div className="col-md-4 text-center sosmed">
              <p>FOLLOW ME</p>
              <a href="http://instagram.com/donnymrshd">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/in/donny-marsahid/">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://twitter.com/donny_mrshd">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://dribbble.com/donnymrshd">
                <i className="fab fa-dribbble"></i>
              </a>
              <a href="https://github.com/donnymarsahid">
                <i className="fab fa-github"></i>
              </a>
            </div>
            <div className="col-md-4 footer-menu">
              <p className="text-uppercase">access rights</p>
              <ul>
                <li>
                  <Link to="/" className="link-footer">
                    <p>Term & Condition</p>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="link-footer">
                    <p>Privacy Policy</p>
                  </Link>
                </li>
              </ul>
            </div>
            <p className="text-center mt-5">&copy; copyright 2021 | DNcoffee `DonnyMarsahid</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
