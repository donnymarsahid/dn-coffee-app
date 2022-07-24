import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { API, getTransactionUser } from '../../config/api';
import loading from '../../assets/img/loading.gif';
import logo from '../../assets/img/logo-waysbucks.svg';
import barcode from '../../assets/img/barcode.svg';
import swal from 'sweetalert';
import { convert } from 'rupiah-format';
import moment from 'moment';
import emptyTransaction from '../../assets/img/empty-transaction.png';

const Transactions = () => {
  const { data: transactionsUser, isLoading, refetch } = useQuery('transactionsUserCache', getTransactionUser);

  const handlerSuccess = useMutation(async (id) => {
    try {
      const body = JSON.stringify({ status: 'success' });
      const config = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.token,
        },
        body,
      };

      swal({
        title: 'Have you received the coffee?',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await API().put('/transaction/' + id, config);
          refetch();
          swal('Enjoy the coffee', {
            icon: 'success',
          });
        } else {
          swal('Happy waiting for coffee to come');
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

  if (transactionsUser?.length === 0) {
    return (
      <>
        <title>DNcoffee | Transactions</title>
        <div className="custom-status flex-column">
          <img src={emptyTransaction} alt="empty-transaction" width="400px" />
          <h3 style={{ color: '#00959C' }}>empty transaction</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <title>DNcoffee | Transactions</title>
      <section className="profile">
        <div class="container">
          <div class="row">
            <div class="col-md-6 transaction all-transaction-page row">
              <h3>All Transaction</h3>
              {transactionsUser?.map((data) => {
                const dataOrders = data.orders.map((item) => {
                  const dataToppings = item.toppings.map((topping) => <p>{topping.title},</p>);
                  return (
                    <div class="list d-flex mb-3">
                      <img src={item.product.image} alt={item.product.image} className="coffee" />
                      <div class="detail-transaction ps-3">
                        <h6 className="text-capitalize">{item.product.title}</h6>
                        <p className="fw-light text-date">{moment(item.createdAt).format('LL')}</p>
                        <div class="topping d-flex">
                          <div className="d-flex pt-2 pb-2">
                            <p className="fw-bold">Topping : </p>
                            <p className="text-capitalize d-flex">{dataToppings}</p>
                          </div>
                        </div>
                        <p className="fw-light">{convert(item.subTotal)}</p>
                      </div>
                    </div>
                  );
                });
                return (
                  <div class="box-transaction mb-5 col-md-6">
                    <div class="row">
                      <div class="col-md-9">{dataOrders}</div>
                      <div class="col-md-3 d-flex flex-column justify-content-center align-items-center">
                        <img src={logo} alt="logo" className="logo" />
                        <img src={barcode} alt="barcode" className="barcode mt-3 mb-3" />
                        {data.status === 'on the way' ? (
                          <>
                            <button class={`btn-profile ${data.status}`} onClick={() => handlerSuccess.mutate(data.id)}>
                              {data.status}
                            </button>
                          </>
                        ) : (
                          <>
                            <button class={`btn-profile ${data.status}`}>{data.status}</button>
                          </>
                        )}
                        <p className="text-total pt-1">Sub Total :</p>
                        <p className="text-total">{convert(data.total)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Transactions;
