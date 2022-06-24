import React, { useContext, useEffect, useState } from "react";
import "./css/style.css";
import { API, getTransactions } from "../../config/api";
import { useMutation, useQuery } from "react-query";
import { convert } from "rupiah-format";
import swal from "sweetalert";
import loading from "../../assets/img/loading.gif";
import { Modal } from "react-bootstrap";
import { io } from "socket.io-client";
import { UserContext } from "../../context/userContext";

let socket;
const IncomeTransaction = () => {
  const { data: transactions, refetch, isLoading } = useQuery("getTransactionsCache", getTransactions);
  const array = [];

  const [transactionModal, setTransactionModal] = useState([]);
  const [transaction, setTransaction] = useState({});
  const [state] = useContext(UserContext);
  const [messages, setMessages] = useState([]);

  const [show, setShow] = useState(false);

  const [contact, setContact] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    socket = io("https://dn-waysbucks.herokuapp.com", {
      auth: {
        token: localStorage.getItem("token"),
      },
      query: {
        id: state.user.id,
      },
    });

    socket.on("new message", () => {
      socket.emit("load messages", contact?.id);
    });

    socket.on("connect_error", (err) => {
      console.error(err.message);
    });

    loadMessages();

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const handlerOnTheWay = useMutation(async (id) => {
    try {
      const body = JSON.stringify({ status: "on the way" });
      const config = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.token,
        },
        body,
      };

      const responseUser = await API().get("/user/" + id);
      setContact(responseUser.data.userDetail.user);

      swal({
        title: "Transaction already entered?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await API().put("/transaction/" + id, config);
          const data = {
            idRecipient: responseUser.data.userDetail.user.id,
            message: `hello ${responseUser.data.userDetail.user.fullname} your order is being shipped, have a nice wait`,
          };
          socket.emit("send message", data);
          refetch();
          swal("Transaction success approve!", {
            icon: "success",
          });
        } else {
          swal("transaction waiting approve");
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

  const loadMessages = () => {
    socket.on("messages", (data) => {
      if (messages.length !== data.length) {
        if (data.length > 0) {
          const dataMessages = data.map((item) => ({
            idSender: item.sender.id,
            message: item.message,
          }));
          setMessages(dataMessages);
        }
      }
    });
  };

  const handlerCancel = useMutation(async (id) => {
    try {
      const body = JSON.stringify({ status: "cancel" });
      const config = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.token,
        },
        body,
      };

      const responseUser = await API().get("/user/" + id);
      setContact(responseUser.data.userDetail.user);

      swal({
        title: "Are you sure cancel?",
        text: "transaction will be canceled!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await API().put("/transaction/" + id, config);

          const data = {
            idRecipient: responseUser.data.userDetail.user.id,
            message: `hello ${responseUser.data.userDetail.user.fullname} your order has been cancelled`,
          };

          socket.emit("send message", data);
          refetch();
          swal("Transaction has been deleted", {
            icon: "success",
          });
        } else {
          swal("Safe transaction data stored");
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

  if (isLoading) {
    return (
      <div className="custom-status">
        <img src={loading} alt="load" width="100px" />
      </div>
    );
  }

  const handlerDetailTransaction = async (id) => {
    try {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      };

      const response = await API().get("/transaction/" + id, config);

      if (response.status === "success") {
        setTransactionModal(response.data.orders);
        setTransaction(response.data);
        handleShow();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <title>WaysBucks | Income Transaction</title>
      <section className="income-transaction">
        <div class="container">
          <h1 className="mb-3">Income Transaction</h1>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Name</th>
                <th scope="col">Address</th>
                <th scope="col">Post Code</th>
                <th scope="col">Income</th>
                <th scope="col">Detail</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((data, index) => {
                return (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{data.name}</td>
                    <td>{data.address}</td>
                    <td>{data.posCode}</td>
                    <td className="column-price">{convert(data.total)}</td>
                    <td className="text-check" onClick={() => handlerDetailTransaction(data.id)}>
                      check
                    </td>
                    <td className={`income ${data.status}`}>{data.status}</td>
                    <td className="text-center">
                      {data.status === "waiting approve" && (
                        <>
                          <button
                            className="me-2 btn-cancel"
                            onClick={() => {
                              handlerCancel.mutate(data.id);
                            }}
                          >
                            cancel
                          </button>
                          <button
                            className="btn-approve"
                            onClick={() => {
                              handlerOnTheWay.mutate(data.id);
                            }}
                          >
                            approve
                          </button>
                        </>
                      )}
                      {data.status === "on the way" && (
                        <>
                          <img src="/images/actions/success.svg" alt="icon-success" className="img-action" />
                        </>
                      )}
                      {data.status === "success" && (
                        <>
                          <img src="/images/actions/success.svg" alt="icon-success" className="img-action" />
                        </>
                      )}
                      {data.status === "cancel" && (
                        <>
                          <img src="/images/actions/cancel.svg" alt="icon-cancel" className="img-action" />
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Modal show={show} centered onHide={handleClose} className="modal-profile">
        <Modal.Header>
          <Modal.Title className="update-profile">Detail Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="row">
            {transactionModal.map((data) => {
              const dataToppings = data.toppings.map((topping) => <>{topping.title},</>);
              return (
                <>
                  <div class="col-md-4">
                    <img src={data.product.image} alt="image" width="100%" />
                    <p className="m-0 text-capitalize text-product">{data.product.title}</p>
                    <p className="m-0 text-capitalize text-topping">{dataToppings}</p>
                  </div>
                </>
              );
            })}
          </div>
          <div class="attachment mt-3 txt-orderid">order_id : {transaction.id}</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-danger-profile" onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default IncomeTransaction;
