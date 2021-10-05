import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { API, getCarts, getUser } from "../../config/api";
import convertRupiah from "rupiah-format";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import trash from "../../assets/img/trash.svg";
import load from "../../assets/img/load.gif";
import loading from "../../assets/img/loading.gif";

const CartPage = () => {
  const history = useHistory();

  const { data: userId, isLoading } = useQuery("getUserIdCache", getUser);

  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState(<img src={load} alt="load" width="50px" />);

  const [showOrder, setShowOrder] = useState(false);
  const handleCloseOrder = () => {
    history.push("/profile");
    window.location.reload();
  };

  useEffect(() => {
    const midtransScriptURL = "https://app.sandbox.midtrans.com/snap/snap.js";
    const midtransClientKey = "SB-Mid-client-VgmmM4o8ZbcepO2E";
    const scriptTag = document.createElement("script");

    scriptTag.src = midtransScriptURL;
    scriptTag.setAttribute("data-client-key", midtransClientKey);
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleShowOrder = () => {
    setShowOrder(true);
    setTimeout(() => {
      setOrder("Thank you for ordering in us, please wait to verify you order");
    }, 2000);
  };

  const { data: carts, refetch } = useQuery("getCartsCache", getCarts);

  console.log(order);

  const [form, setForm] = useState({
    name: userId?.fullname,
    email: userId?.email,
    phone: userId?.phone,
    posCode: userId?.posCode,
    address: userId?.address,
    image: "",
  });

  const { name, email, phone, posCode, address, image } = form;

  const handlerInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const dataId = [];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlerDelete = (id) => {
    handleShow();
    setIdDelete(id);
    console.log(id);
  };

  const deleteById = useMutation(async (id) => {
    try {
      const config = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      };
      await API().delete("/cart/" + id, config);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  const actionDelete = () => {
    setConfirmDelete(true);
  };

  useEffect(() => {
    if (confirmDelete) {
      handleClose();
      deleteById.mutate(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete, deleteById, idDelete]);
  const [fileUpload, setFileUpload] = useState("/images/upload-file.svg");

  const array = [];

  if (isLoading) {
    return (
      <div className="custom-status">
        <img src={loading} alt="load" width="100px" />
      </div>
    );
  }

  if (carts?.length === 0) {
    return (
      <>
        <title>WaysBucks | Cart</title>
        <section className="cart-page-null d-flex align-items-center justify-content-center flex-column">
          <img src="/images/empty-cart.png" alt="empty-cart" width="530px" />
          <Link to="/all-menu">
            <button class="btn-empty">Order Now</button>
          </Link>
        </section>
      </>
    );
  }

  console.log(carts);

  const cartsProducts = carts?.map((data) => {
    const dataPrice = [];

    dataId.push(data.id);
    dataPrice.push(data.product.price);

    const dataTopping = data.toppings.map((topping) => {
      dataPrice.push(topping.price);
      return <p className="text-topping">{topping.title},</p>;
    });

    const resultPrice = dataPrice.reduce((acc, curr) => acc + curr);

    array.push(resultPrice);

    return (
      <div className="list-cart mb-3 d-flex align-items-center justify-content-between">
        <div className="image-description d-flex align-items-center">
          <img src={data.product.image} alt="product" className="me-3" />
          <div className="description">
            <p className="text-capitalize">{data.product.title}</p>
            <div class="topping d-flex flex-row">
              {data.toppings.length === 0 ? (
                <p className="text-topping-nf">No Topping</p>
              ) : (
                <>
                  <p className="fw-bolder">Topping : </p>
                  {dataTopping}
                </>
              )}
              <p></p>
            </div>
          </div>
        </div>
        <div className="price-remove text-end">
          <p>{convertRupiah.convert(resultPrice)}</p>
          <img
            src={trash}
            alt="trash"
            onClick={() => {
              handlerDelete(data.id);
            }}
            className="trash"
          />
        </div>
      </div>
    );
  });

  const totalPriceAll = array.reduce((acc, curr) => acc + curr);

  const handlerFile = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setTimeout(() => {
        setFileUpload(url);
      }, 1500);
      setFileUpload(load);
    }
  };

  if (name === undefined) {
    setForm({
      name,
    });
  }
  if (email === undefined) {
    setForm({
      email,
    });
  }
  if (phone === undefined) {
    setForm({
      phone,
    });
  }
  if (posCode === undefined) {
    setForm({
      posCode,
    });
  }
  if (address === undefined) {
    setForm({
      address,
    });
  }
  const handlerSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name,
        email,
        total: totalPriceAll,
        phone,
        posCode,
        address,
      };

      const body = JSON.stringify(data);

      const config = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.token,
          "Content-type": "application/json",
        },
        body,
      };

      const response = await API().post("/transaction", config);

      const token = response.payment.token;

      window.snap.pay(token, {
        onSuccess: function (result) {
          history.push("/profile");
          console.log(result);
        },
        onPending: function (result) {
          alert("wating your payment!");
          console.log(result);
        },
        onError: function (result) {
          alert("payment failed!");
          console.log(result);
        },
        onClose: function () {
          alert("you closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <title>WaysBucks | Cart</title>
      <section className="cart-page">
        <div className="container">
          <form onSubmit={handlerSubmit}>
            <div className="row">
              <div className="title">
                <h1>My Cart</h1>
                <h5>Review Your Order</h5>
              </div>
              <div className="col-md-7">
                <div className="parent-list">{cartsProducts}</div>
                <div class="row">
                  <div class="col-md-12">
                    <div className="sub-total d-flex justify-content-between">
                      <div className="detail mt-3">
                        <p>Subtotal</p>
                        <p>Quantity</p>
                      </div>
                      <div className="detail-2 mt-3 text-end">
                        <p>{convertRupiah.convert(totalPriceAll)}</p>
                        <p>{carts?.length}</p>
                      </div>
                    </div>
                    <div className="total d-flex justify-content-between">
                      <p>Total</p>
                      <p>{convertRupiah.convert(totalPriceAll)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-5 d-flex flex-column">
                {message && (
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                )}
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeHolder="Name"
                  defaultValue={userId.fullname}
                  className="mb-4"
                  required
                  onChange={handlerInput}
                  autoComplete="off"
                />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeHolder="Email"
                  defaultValue={userId.email}
                  className="mb-4"
                  required
                  onChange={handlerInput}
                  autoComplete="off"
                />
                <input type="number" name="phone" id="phone" placeHolder="Phone" defaultValue={userId.phone} className="mb-4" required onChange={handlerInput} />
                <input
                  type="number"
                  name="posCode"
                  id="postcode"
                  placeHolder="Pos Code"
                  defaultValue={userId.posCode}
                  className="mb-4"
                  required
                  onChange={handlerInput}
                />
                <textarea name="address" id="address" cols="30" rows="10" placeHolder="Address" defaultValue={userId.address} onChange={handlerInput}></textarea>
                <button type="submit" className="btn-pay">
                  Checkout
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
      <Modal show={show} onHide={handleClose} centered className="text-center modal-delete">
        <Modal.Body>
          <h5>Are You Sure Delete Cart?</h5>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <button onClick={handleClose} className="btn-closed">
            cancel
          </button>
          <button onClick={actionDelete} className="btn-delete">
            delete
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showOrder} centered onHide={handleCloseOrder} className="modal-order-success">
        <Modal.Body className="d-flex justify-content-center">{order}</Modal.Body>
        <Modal.Footer>
          {order !== "Thank you for ordering in us, please wait to verify you order" ? (
            <>
              <button className="btn-order d-none"></button>
            </>
          ) : (
            <>
              <button className="btn-order" onClick={handleCloseOrder}>
                oke
              </button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CartPage;
