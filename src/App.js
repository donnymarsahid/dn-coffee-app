import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./pages/guest/components/Navbar";
import NavbarUsers from "./pages/users/components/Navbar";
import "./App.css";
import Footer from "./assets/components/Footer";
import Guest from "./pages/guest/Guest";
import { useContext, useEffect } from "react";
import Users from "./pages/users/Users";
import AllMenu from "./pages/guest/AllMenu";
import AllMenuUsers from "./pages/users/AllMenu";
import ScrollToTop from "./assets/components/ScrollToTop";
import DetailPage from "./pages/users/DetailPage";
import CartPage from "./pages/users/CartPage";
import Profile from "./pages/users/Profile";
import AddProduct from "./pages/admin/components/createData/AddProduct";
import AddTopping from "./pages/admin/components/createData/AddTopping";
import IncomeTransaction from "./pages/admin/IncomeTransaction";
import Admin from "./pages/admin/Admin";
import NavbarAdmin from "./pages/admin/components/NavbarAdmin";
import NoMatch from "./404/NoMatch";
import { UserContext } from "./context/userContext";
import { API } from "./config/api";
import TableProduct from "./pages/admin/components/tableData/TableProduct";
import TableUser from "./pages/admin/components/tableData/TableUser";
import TableTopping from "./pages/admin/components/tableData/TableTopping";
import UpdateProduct from "./pages/admin/components/updateData/UpdateProduct";
import UpdateTopping from "./pages/admin/components/updateData/UpdateTopping";
import About from "./pages/guest/About";
import Transactions from "./pages/users/Transactions";
import ContactUsers from "./pages/users/Contact";
import Contact from "./pages/guest/Contact";
import ResetPassword from "./pages/guest/ResetPassword";

function App() {
  const [state, dispatch] = useContext(UserContext);

  const checkAuth = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      };

      const response = await API().get("/check-auth", config);

      let payload = response.data.user;
      payload.token = localStorage.token;

      if (response.status === "failed") {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      dispatch({
        type: "AUTH_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (state.user.status === "user") {
    return (
      <>
        <Router>
          <ScrollToTop />
          <NavbarUsers />
          <Switch>
            <Route path="/" exact component={Users} />
            <Route path="/all-menu" component={AllMenuUsers} />
            <Route path="/contact" component={ContactUsers} />
            <Route path="/detail-page/:id" component={DetailPage} />
            <Route path="/cart-page" component={CartPage} />
            <Route path="/profile" component={Profile} />
            <Route path="/about" component={About} />
            <Route path="/all-transaction" component={Transactions} />
            <Route path="/*" component={NoMatch} />
          </Switch>
          <Footer />
        </Router>
      </>
    );
  }

  if (state.user.status === "admin") {
    return (
      <Router>
        <ScrollToTop />
        <NavbarAdmin />
        <Switch>
          <Route path="/" exact component={Admin} />
          <Route path="/admin" exact component={Admin} />
          <Route path="/admin/product" exact component={TableProduct} />
          <Route path="/admin/product/add-product" component={AddProduct} />
          <Route path="/admin/update-product/:id" component={UpdateProduct} />
          <Route path="/admin/topping" exact component={TableTopping} />
          <Route path="/admin/topping/add-topping" component={AddTopping} />
          <Route path="/admin/update-topping/:id" component={UpdateTopping} />
          <Route path="/admin/user" exact component={TableUser} />
          <Route
            path="/admin/income-transaction"
            component={IncomeTransaction}
          />
          <Route path="/*" component={NoMatch} />
        </Switch>
        <Footer />
      </Router>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Switch>
        <Route path="/" exact component={Guest} />
        <Route path="/all-menu" component={AllMenu} />
        <Route path="/contact" component={Contact} />
        <Route path="/about" component={About} />
        <Route path="/reset-password/:id" component={ResetPassword} />
        <Route path="/*" component={NoMatch} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
