import React, { useContext } from 'react';
import product from '../../assets/img/product.svg';
import topping from '../../assets/img/topping.svg';
import incomeTransaction from '../../assets/img/income-transaction.svg';
import chartsDonnut from '../../assets/img/charts-donnut.svg';
import twitter from '../../assets/img/icon-twitter.svg';
import facebook from '../../assets/img/icon-facebook.svg';
import instagram from '../../assets/img/icon-instagram.svg';
import diagram from '../../assets/img/diagram.png';
import usersIcon from '../../assets/img/users.svg';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { getProducts, getToppings, getTransactions, getUsers } from '../../config/api';
import { useQuery } from 'react-query';
import loading from '../../assets/img/loading.gif';
import ChartOrders from './components/ChartOrders';

const Admin = (props) => {
  const [state, dispatch] = useContext(UserContext);

  const { data: products, isLoading } = useQuery('productsCache', getProducts);
  const { data: toppings, isLoading: loadingTopping } = useQuery('toppingsCache', getToppings);
  const { data: users, isLoading: loadUsers } = useQuery('usersCache', getUsers);
  const { data: transactions, isLoading: loadTransactions } = useQuery('getTransactionsCache', getTransactions);

  if (isLoading || loadingTopping || loadUsers || loadTransactions) {
    return (
      <div className="custom-status">
        <img src={loading} alt="load" width="100px" />
      </div>
    );
  }

  return (
    <>
      <title>DNcoffee | Admin</title>
      <section className="admin">
        <div class="container">
          <div class="row d-flex justify-content-between">
            <div class="col-md-4 box box-income-transaction d-flex justify-content-between">
              <div class="d-flex flex-column justify-content-between info">
                <div className="title">
                  <p class="text-uppercase m-0">Income Transaction</p>
                  <p>Total : {transactions.length}</p>
                </div>
                <div class="check">
                  <Link to="/admin/income-transaction" class="link-router">
                    <p className="text-decoration-underline m-0">check details</p>
                  </Link>
                </div>
              </div>
              <div class="icon d-flex flex-column justify-content-md-end">
                <img src={incomeTransaction} alt="income-transaction" />
              </div>
            </div>
            <div class="col-md-4 box box-product d-flex justify-content-between">
              <div class="d-flex flex-column justify-content-between info">
                <div className="title">
                  <p class="text-uppercase m-0">Product</p>
                  <p>Total : {products?.length}</p>
                </div>
                <div class="check">
                  <Link to="/admin/product" class="link-router">
                    <p className="text-decoration-underline m-0">check details</p>
                  </Link>
                </div>
              </div>
              <div class="icon d-flex flex-column justify-content-md-end">
                <img src={product} alt="income-transaction" />
              </div>
            </div>
            <div class="col-md-4 box box-topping d-flex justify-content-between">
              <div class="d-flex flex-column justify-content-between info">
                <div className="title">
                  <p class="text-uppercase m-0">Topping</p>
                  <p>Total : {toppings?.length}</p>
                </div>
                <div class="check">
                  <Link to="/admin/topping" class="link-router">
                    <p className="text-decoration-underline m-0">check details</p>
                  </Link>
                </div>
              </div>
              <div class="icon d-flex flex-column justify-content-md-end">
                <img src={topping} alt="income-transaction" />
              </div>
            </div>
          </div>
          <div class="row social-media d-flex justify-content-between mt-5">
            <a class="col-md-4 p-0 pe-3 text-decoration-none followers" href="https://twitter.com/waysbucks">
              <div class="box-sosmed d-flex justify-content-between align-items-center">
                <img src={chartsDonnut} alt="charts-donnut" />
                <p class="text-uppercase m-0">Twitter Tweets</p>
                <img src={twitter} alt="twitter" />
              </div>
            </a>
            <a class="col-md-4 pe-3 ps-3 text-decoration-none followers" href="https://www.facebook.com/waysbucks">
              <div class="box-sosmed d-flex justify-content-between align-items-center">
                <img src={chartsDonnut} alt="charts-donnut" />
                <p class="text-uppercase m-0">Facebook Followers</p>
                <img src={facebook} alt="facebook" />
              </div>
            </a>
            <a class="col-md-4 p-0 ps-3 text-decoration-none followers" href="http://instagram.com/waysbucks">
              <div class="box-sosmed d-flex justify-content-between align-items-center">
                <img src={chartsDonnut} alt="charts-donnut" />
                <p class="text-uppercase m-0">Instagram Followers</p>
                <img src={instagram} alt="instagram" />
              </div>
            </a>
          </div>
          <div class="diagram-users">
            <div class="row diagram-users d-flex justify-content-between mt-5">
              <div class="col-md-8 diagram">
                <ChartOrders />
              </div>
              <div class="col-md-4 box box-users d-flex justify-content-between">
                <div class="d-flex flex-column justify-content-between info">
                  <div className="title">
                    <p class="text-uppercase m-0">Users DNcoffee</p>
                    <p>Total : {users?.length - 1}</p>
                  </div>
                  <div class="check">
                    <Link to="/admin/user" class="link-router">
                      <p className="text-decoration-underline m-0">check details</p>
                    </Link>
                  </div>
                </div>
                <div class="icon d-flex flex-column justify-content-md-end">
                  <img src={usersIcon} alt="users" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Admin;
