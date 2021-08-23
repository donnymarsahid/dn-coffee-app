import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './guest/components/Navbar';
import NavbarUsers from './users/components/Navbar';
import './App.css';
import Footer from './assets/components/Footer';
import Guest from './guest/Guest';
import { useEffect, useState } from 'react';
import dataCoffeeVariant from './data/coffeeVariant.json';
import dataAllCoffee from './data/allCoffee.json';
import { createContext } from 'react';
import Users from './users/Users';
import dataAccount from './data/account.json';
import AllMenu from './guest/AllMenu';
import Coffee from './guest/Coffee';
import AllMenuUsers from './users/AllMenu';
import CoffeeUsers from './users/Coffee';
import ScrollToTop from './assets/components/ScrollToTop';
import DetailPage from './users/DetailPage';
import CartPage from './users/CartPage';
import Profile from './users/Profile';
import AddProduct from './admin/AddProduct';
import AddTopping from './admin/AddTopping';
import IncomeTransaction from './admin/IncomeTransaction';
import Admin from './admin/Admin';
import dataAdmin from './data/admin.json';
import NavbarAdmin from './admin/components/NavbarAdmin';

function App() {
  const dataAccountAuth = JSON.parse(localStorage.getItem('user_auth'));
  const dataAdminAuth = JSON.parse(localStorage.getItem('admin_auth'));
  const loginAuth = JSON.parse(localStorage.getItem('login_auth'));

  const [coffeeVariant, setCoffeeVariant] = useState([]);
  const [allCoffee, setAllCoffee] = useState([]);
  const [account] = useState(dataAccountAuth);
  const [accountAdmin] = useState(dataAdminAuth);
  const [login] = useState(loginAuth);

  useEffect(() => {
    setCoffeeVariant(dataCoffeeVariant);
    setAllCoffee(dataAllCoffee);
  }, [coffeeVariant, allCoffee, account, accountAdmin]);

  if (!login) {
    localStorage.setItem('login_auth', false);
    localStorage.setItem('user_auth', JSON.stringify(dataAccount));
    localStorage.setItem('admin_auth', JSON.stringify(dataAdmin));
    return (
      <Router>
        <context.Provider value={{ coffeeVariant, allCoffee }}>
          <ScrollToTop />
          <Navbar />
          <Switch>
            <Route path="/" exact component={Guest} />
            <Route path="/all-menu" component={AllMenu} />
            <Route path="/coffee" component={Coffee} />
          </Switch>
          <Footer />
        </context.Provider>
      </Router>
    );
  }

  if (login && login !== 'admin') {
    return (
      <>
        <Router>
          <context.Provider value={{ coffeeVariant, allCoffee }}>
            <ScrollToTop />
            <NavbarUsers />
            <Switch>
              <Route path="/" exact component={Users} />
              <Route path="/all-menu" component={AllMenuUsers} />
              <Route path="/coffee" component={CoffeeUsers} />
              <Route path="/detail-page/:id" component={DetailPage} />
              <Route path="/cart-page" component={CartPage} />
              <Route path="/profile" component={Profile} />
            </Switch>
            <Footer />
          </context.Provider>
        </Router>
      </>
    );
  }

  if (login === 'admin') {
    return (
      <Router>
        <context.Provider>
          <ScrollToTop />
          <NavbarAdmin />
          <Switch>
            <Route path="/admin" exact component={Admin} />
            <Route path="/admin/add-product" component={AddProduct} />
            <Route path="/admin/add-topping" component={AddTopping} />
            <Route path="/admin/income-transaction" component={IncomeTransaction} />
          </Switch>
          <Footer />
        </context.Provider>
      </Router>
    );
  }
}

export const context = createContext();
export default App;
