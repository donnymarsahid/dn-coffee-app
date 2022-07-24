import React, { useState } from 'react';
import '../../css/style.css';
import clip from '../../../../assets/img/clip.svg';
import { useMutation, useQuery } from 'react-query';
import { API } from '../../../../config/api';
import { useHistory, useParams, Link } from 'react-router-dom';
import swal from 'sweetalert';

const UpdateProduct = () => {
  const history = useHistory();
  const { id } = useParams();

  const [message, setMessage] = useState('');

  const { data: detailProduct, refetch } = useQuery('detailProductCache', async () => {
    const response = await API().get('/product/' + id);
    return response.data.product;
  });

  console.log(detailProduct);

  const [form, setForm] = useState({
    title: detailProduct?.title,
    price: detailProduct?.price,
    image: detailProduct?.image,
    status: 'available',
  });

  console.log(detailProduct?.price);

  // const [fileUpload, setFileUpload] = useState(detailProduct?.image);

  const { title, price, image, status } = form;

  const handlerInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value,
    });

    if (e.target.type === 'file') {
      URL.createObjectURL(e.target.files[0]);
      // setFileUpload(url);
    }
  };

  const handlerChecked = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked === true ? 'not available' : 'available' });
  };

  const handlerSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.set('title', title);
      formData.set('price', price);
      formData.set('image', image);
      formData.set('status', status);

      const config = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + localStorage.token,
        },
        body: formData,
      };

      const response = await API().put('/product/' + id, config);
      console.log(response);
      refetch();
      if (response.message) {
        setMessage(response.message);
        return false;
      }

      swal({
        title: 'Success Update Product',
        text: 'product updated!',
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
      <title>DNcoffee | Update Product</title>
      <section className="add-product">
        <div class="container">
          <div class="row">
            <div class="col-md-7">
              <h1>Update Product</h1>
              {message && (
                <div class="alert alert-danger" role="alert">
                  {message}
                </div>
              )}
              <form className="d-flex flex-column" onSubmit={(e) => handlerSubmit.mutate(e)}>
                <input type="text" defaultValue={detailProduct?.title} name="title" id="name" placeHolder="Name Product" onChange={handlerInput} />
                <input type="number" defaultValue={detailProduct?.price} name="price" id="price" placeHolder="Price" className="mt-4 mb-4" onChange={handlerInput} />
                <input type="file" name="image" id="image" className="d-none" onChange={handlerInput} />
                <label for="image" className="label-upload mb-4 d-flex justify-content-between">
                  Photo Product
                  <img src={clip} alt="clip" width="15px" />
                </label>
                <div class="check">
                  <input class="form-check-input" type="checkbox" value="not available" name="status" id="defaultCheck1" onChange={handlerChecked} />
                  <label class="form-check-label" for="defaultCheck1">
                    <p class="m-0">Not Available</p>
                  </label>
                </div>
                <div class="button d-flex flex-column">
                  <button class="btn-add-product" type="submit">
                    Update Product
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
              <img src={detailProduct?.image} alt="coffee" className="img-upload" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateProduct;
