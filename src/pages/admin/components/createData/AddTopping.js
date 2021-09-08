import React, { useState } from 'react';
import '../../css/style.css';
import clip from '../../../../assets/img/clip.svg';
import { useMutation } from 'react-query';
import { API } from '../../../../config/api';
import { useHistory } from 'react-router';
import swal from 'sweetalert';

const AddTopping = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    title: '',
    price: 0,
    image: '',
  });
  const [message, setMessage] = useState('');
  const [fileUpload, setFileUpload] = useState('/images/upload.png');

  const { title, price, image } = form;

  const handlerInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value,
    });

    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0]);
      setFileUpload(url);
    }
  };

  const handlerSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      if (title === '' || price === 0) {
        setMessage('insert title or price');
        setTimeout(() => {
          setMessage('');
        }, 3000);
        return false;
      }

      const formData = new FormData();
      formData.set('title', title);
      formData.set('price', price);
      formData.set('image', image);

      const config = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.token,
        },
        body: formData,
      };

      const response = await API().post('/topping', config);
      console.log(response);
      if (response.status === 'failed') {
        setMessage(response.message);
        setTimeout(() => {
          setMessage('');
        }, 3000);
        return false;
      }
      if (response.message) {
        setMessage(response.message);
        setTimeout(() => {
          setMessage('');
        }, 3000);
        return false;
      }

      swal({
        title: 'Success Add Topping',
        text: 'new topping added!',
        icon: 'success',
        button: 'oke',
      });

      history.push('/admin/topping');
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <>
      <section className="add-product">
        <div class="container">
          <div class="row">
            <div class="col-md-7">
              <h1>Topping</h1>
              {message && (
                <div class="alert alert-danger" role="alert">
                  {message}
                </div>
              )}
              <form className="d-flex flex-column" onSubmit={(e) => handlerSubmit.mutate(e)}>
                <input type="text" name="title" id="name" placeHolder="Name Topping" onChange={handlerInput} />
                <input type="number" name="price" id="price" placeHolder="Price" className="mt-4 mb-4" onChange={handlerInput} />
                <input type="file" name="image" id="image" className="d-none" onChange={handlerInput} />
                <label for="image" className="label-upload mb-4 d-flex justify-content-between">
                  Photo Topping
                  <img src={clip} alt="clip" width="15px" />
                </label>
                <button class="btn-add-product" type="submit">
                  Add Topping
                </button>
              </form>
            </div>
            <div class="col-md-5 d-flex justify-content-center align-items-center">
              <img src={fileUpload} alt="topping" className="img-upload" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddTopping;
