export const API = () => {
  const baseUrl = "http://localhost:3001/api/v1/";

  const executeAPI = async (endpoint, config) => {
    const response = await fetch(baseUrl + endpoint, config);
    const data = await response.json();
    return data;
  };

  return {
    get: executeAPI,
    post: executeAPI,
    put: executeAPI,
    delete: executeAPI,
  };
};

// Product
export const getProducts = async () => {
  const response = await API().get("/products");
  return response.data.products;
};

// Topping
export const getToppings = async () => {
  const response = await API().get("/toppings");
  return response.data.toppings;
};

// TypeCoffee
export const getTypeCoffee = async () => {
  const response = await API().get("/typecoffee");
  return response.data.products;
};

// Users
export const getUsers = async () => {
  const config = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.token,
    },
  };
  const response = await API().get("/users", config);
  return response.data.users;
};

// User By Id
export const getUser = async () => {
  const config = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.token,
    },
  };
  const response = await API().get("/user", config);
  return response.data;
};

// Cart
export const getCarts = async () => {
  const config = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.token,
    },
  };
  const response = await API().get("/carts", config);
  return response.data;
};

// Transaction
export const getTransactionUser = async () => {
  const config = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.token,
    },
  };
  const response = await API().get("/transaction", config);
  return response.data;
};

// Transactions
export const getTransactions = async () => {
  const config = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.token,
    },
  };
  const response = await API().get("/transactions", config);
  return response.data;
};
