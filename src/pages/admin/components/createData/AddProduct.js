import React, { useState } from 'react';
import '../../css/style.css';
import clip from '../../../../assets/img/clip.svg';
import { useMutation } from 'react-query';
import { API } from '../../../../config/api';
import { useHistory, Link } from 'react-router-dom';
import swal from 'sweetalert';

const AddProduct = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    title: '',
    price: 0,
    image: '',
    typeCoffee: '',
    status: 'available',
  });
  const [message, setMessage] = useState('');
  const [fileUpload, setFileUpload] = useState('/images/upload.png');

  const { title, price, image, typeCoffee, status } = form;

  const handlerInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const [namePath, setNamePath] = useState('Photo Product');
  const handlerFile = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
    const path = e.target.value;
    const format = path.replace(/^.*\\/, '');
    setNamePath(format);
    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0]);
      setFileUpload(url);
    }
  };

  const handlerChecked = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked === true ? e.target.value : '' });
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
      formData.set('typeCoffee', typeCoffee);
      formData.set('status', status);

      const config = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.token,
        },
        body: formData,
      };

      const response = await API().post('/product', config);
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
        title: 'Success Add Product',
        text: 'new product added!',
        icon: 'success',
        button: 'oke',
      });

      history.push('/admin/product');
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <title>DNcoffee | Add Product</title>

      <section className="add-product">
        <div class="container">
          <div class="row">
            <div class="col-md-7">
              <h1>Product</h1>
              {message && (
                <div class="alert alert-danger" role="alert">
                  {message}
                </div>
              )}
              <form className="d-flex flex-column" onSubmit={(e) => handlerSubmit.mutate(e)}>
                <input type="text" name="title" id="name" placeHolder="Name Product" onChange={handlerInput} />
                <input type="number" name="price" id="price" placeHolder="Price" className="mt-4 mb-4" onChange={handlerInput} />
                <input type="file" name="image" id="image" className="d-none" onChange={handlerFile} />
                <label for="image" className="label-upload mb-4 d-flex justify-content-between">
                  {namePath}
                  <img src={clip} alt="clip" width="15px" />
                </label>
                <div class="check">
                  <input class="form-check-input" type="checkbox" value="coffee variant" name="typeCoffee" id="defaultCheck1" onChange={handlerChecked} />
                  <label class="form-check-label" for="defaultCheck1">
                    <p class="m-0">Coffee Variant</p>
                  </label>
                </div>
                <div class="button d-flex flex-column">
                  <button class="btn-add-product" type="submit">
                    Add Product
                  </button>
                  <div class="btn-backed d-flex justify-content-between">
                    <div></div>
                    <Link to="/admin/product" className="text-decoration-none">
                      <div className="btn-back mt-3">Back</div>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
            <div class="col-md-5 d-flex justify-content-center align-items-center">
              <img src={fileUpload} alt="coffee" className="img-upload" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddProduct;
