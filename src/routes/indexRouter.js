const express = require("express");
const router = express.Router();

const { login, register, checkAuth, forgetPassword, resetPassword } = require("../controllers/auth");
const { getCarts, addCart, deleteCart, getOrders } = require("../controllers/cart");
const { addProduct, getProducts, detailProduct, updateProduct, deleteProduct, getTypeCoffee } = require("../controllers/product");
const { getToppings, addTopping, detailTopping, updateTopping, deleteTopping } = require("../controllers/topping");
const {
  addTransaction,
  getTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  getDetailTransaction,
  notification,
} = require("../controllers/transaction");
const { getUsers, deleteUser, getUser, updateUser, getUserDetail } = require("../controllers/user");
const { authToken, permission } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

// Authentification
router.post("/login", login);
router.post("/register", register);
router.get("/check-auth", authToken, checkAuth);
router.post("/forget-password", forgetPassword);
router.put("/reset-password/:id", resetPassword);

// User
router.get("/users", authToken, permission("admin"), getUsers);
router.get("/user", authToken, getUser);
router.get("/user/:id", getUserDetail);
router.put("/user", authToken, uploadFile("image"), updateUser);
router.delete("/user/:id", authToken, permission("admin"), deleteUser);

// Product
router.get("/products", getProducts);
router.get("/product/:id", detailProduct);
router.get("/typecoffee", getTypeCoffee);
router.post("/product", authToken, permission("admin"), uploadFile("image"), addProduct);
router.put("/product/:id", authToken, permission("admin"), uploadFile("image"), updateProduct);
router.delete("/product/:id", authToken, permission("admin"), deleteProduct);

// Topping
router.get("/toppings", getToppings);
router.get("/topping/:id", detailTopping);
router.post("/topping", authToken, permission("admin"), uploadFile("image"), addTopping);
router.put("/topping/:id", authToken, permission("admin"), uploadFile("image"), updateTopping);
router.delete("/topping/:id", authToken, permission("admin"), deleteTopping);

// Cart
router.get("/carts", authToken, getCarts);
router.post("/cart/:id", authToken, addCart);
router.delete("/cart/:id", authToken, deleteCart);

// Order
router.get("/orders", authToken, getOrders);

// Transaction
router.get("/transaction", authToken, getTransaction);
router.get("/transactions", authToken, permission("admin"), getTransactions);
router.post("/transaction", authToken, addTransaction);
router.put("/transaction/:id", authToken, updateTransaction);
router.delete("/transaction/:id", authToken, permission("admin"), deleteTransaction);
router.get("/transaction/:id", authToken, permission("admin"), getDetailTransaction);
router.post("/notification", notification);

module.exports = router;
