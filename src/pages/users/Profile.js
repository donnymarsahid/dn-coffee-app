import React, { useState } from 'react';
import logo from '../../assets/img/logo-waysbucks.svg';
import barcode from '../../assets/img/barcode.svg';
import { useMutation, useQuery } from 'react-query';
import { API, getTransactionUser, getUser } from '../../config/api';
import moment from 'moment';
import { convert } from 'rupiah-format';
import { Modal } from 'react-bootstrap';
import clip from '../../assets/img/clip.svg';
import swal from 'sweetalert';
import loading from '../../assets/img/loading.gif';
import { Link } from 'react-router-dom';
import load from '../../assets/img/load.gif';

const Profile = () => {
  const { data: transactionsUserId, refetch, isLoading: loadingTransaction } = useQuery('transactionsUserCache', getTransactionUser);
  const { data: userId, refetch: refetchUser, isLoading } = useQuery('getUserIdCache', getUser);

  const transactionsUser = transactionsUserId?.slice(0, 3);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [form, setForm] = useState({
    fullname: '',
    image: '',
    phone: '',
    posCode: '',
    address: '',
  });

  const { fullname, image, phone, posCode, address } = form;

  const [imageChange, setImageChange] = useState(true);
  const [namePath, setNamePath] = useState('upload image');

  const handlerInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlerFile = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
    const path = e.target.value;
    const format = path.replace(/^.*\\/, '');
    setNamePath(format);
  };

  const handlerSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      console.log(form);

      setImageChange(false);

      const formData = new FormData();
      formData.set('image', image);
      formData.set('fullname', fullname);
      formData.set('phone', phone);
      formData.set('posCode', posCode);
      formData.set('address', address);

      const config = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + localStorage.token,
        },
        body: formData,
      };

      const response = await API().put('/user', config);
      if (response) {
        setTimeout(() => {
          setImageChange(true);
        }, 2000);
        refetchUser();
      }

      if (response.status === 'success') {
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  });

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

  if (isLoading || loadingTransaction) {
    return (
      <div className="custom-status">
        <img src={loading} alt="load" width="100px" />
      </div>
    );
  }

  return (
    <>
      <title>DNcoffee | Profile</title>
      <section className="profile mb-5">
        <div class="container-profile">
          <div class="row">
            <div class="col-md-6 d-flex">
              <div class="title-image">
                <h3 className="mb-3">My Profile</h3>
                <div class="detail d-flex ">
                  <div class="profile-image d-flex flex-column">
                    <input type="file" name="image" id="upload" className="d-none" />
                    <label for="upload">{imageChange ? <img src={userId?.image} alt="profile" className="profile" /> : <img src={load} alt="profile" width="200px" />}</label>
                    <button className="btn-change-profile mt-3" onClick={handleShow}>
                      <i class="fas fa-cog pe-1"></i>setting profile
                    </button>
                  </div>
                  <div class="text ps-4">
                    <p>FullName : {userId?.fullname}</p>
                    <p>Email : {userId?.email}</p>
                    <p>Phone : {userId?.phone === null ? <>-</> : userId.phone}</p>
                    <p>PosCode : {userId?.posCode === null ? <>-</> : userId.posCode}</p>
                    <p>Address : {userId?.address === null ? <>-</> : userId.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 transaction">
              <h3>My Transaction</h3>
              {transactionsUser?.length === 0 && (
                <>
                  <div class="box-empty-transaction-profile">
                    <p>empty transaction</p>
                  </div>
                </>
              )}
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
                  <div class="box-transaction mb-5">
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
              <Link to="/all-transaction">
                <p className="text-center text-uppercase text-decoration-underline">show all transactions</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Modal show={show} centered onHide={handleClose} className="modal-profile">
        <Modal.Header>
          <Modal.Title className="update-profile">Setting Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="d-flex flex-column form-profile ps-2 pe-2">
            <label for="fullname" className="text-profile">
              FullName
            </label>
            <input type="text" name="fullname" id="fullname" Value={userId?.fullname} onChange={handlerInput} required />
            <label for="phone" className="text-profile">
              Phone
            </label>
            <input type="text" name="phone" id="phone" Value={userId?.phone} onChange={handlerInput} />
            <label for="posCode" className="text-profile">
              PosCode
            </label>
            <input type="text" name="posCode" onChange={handlerInput} Value={userId?.posCode} />
            <label for="address" className="text-profile">
              Address
            </label>
            <textarea name="address" id="address" defaultValue={userId?.address} cols="30" rows="10" onChange={handlerInput}></textarea>
            <input type="file" name="image" id="image" className="d-none" onChange={handlerFile} required />
            <p className="m-0 mt-2 text-profile">Image</p>
            <label for="image" className="input-profile d-flex justify-content-between mb-3">
              <p className="m-0">{namePath}</p>
              <img src={clip} alt="clip" width="15px" />
            </label>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-close-profile" onClick={handleClose}>
            Close
          </button>
          <button className="btn-danger-profile" onClick={(e) => handlerSubmit.mutate(e)}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
