import React, { useState } from 'react';
import '../../css/style.css';
import clip from '../../../../assets/img/clip.svg';
import { useMutation, useQuery } from 'react-query';
import { API } from '../../../../config/api';
import { useHistory, useParams, Link } from 'react-router-dom';
import swal from 'sweetalert';

const UpdateTopping = () => {
  const history = useHistory();
  const { id } = useParams();

  const [message, setMessage] = useState('');

  const { data: detailTopping, refetch } = useQuery('detailToppingCache', async () => {
    const response = await API().get('/topping/' + id);
    return response.data.topping;
  });

  const [form, setForm] = useState({
    title: detailTopping?.title,
    price: detailTopping?.price,
    image: detailTopping?.image,
  });

  console.log(detailTopping?.price);

  // const [fileUpload, setFileUpload] = useState(detailTopping?.image);

  const { title, price, image, status } = form;

  const handlerInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value,
    });

    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0]);
      // setFileUpload(url);
    }
  };

  const handlerSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.set('title', title);
      formData.set('price', price);
      formData.set('image', image);

      console.log(status);

      const config = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + localStorage.token,
        },
        body: formData,
      };

      const response = await API().put('/topping/' + id, config);
      console.log(response);
      refetch();
      if (response.message) {
        setMessage(response.message);
        return false;
      }

      swal({
        title: 'Success Update Topping',
        text: 'topping updated!',
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
      <title>DNcoffee | Update Topping</title>
      <section className="add-product">
        <div class="container">
          <div class="row">
            <div class="col-md-7">
              <h1>Update Topping</h1>
              {message && (
                <div class="alert alert-danger" role="alert">
                  {message}
                </div>
              )}
              <form className="d-flex flex-column" onSubmit={(e) => handlerSubmit.mutate(e)}>
                <input type="text" defaultValue={detailTopping?.title} name="title" id="name" placeHolder="Name Product" onChange={handlerInput} />
                <input type="number" defaultValue={detailTopping?.price} name="price" id="price" placeHolder="Price" className="mt-4 mb-4" onChange={handlerInput} />
                <input type="file" name="image" id="image" className="d-none" onChange={handlerInput} />
                <label for="image" className="label-upload mb-4 d-flex justify-content-between">
                  Photo Product
                  <img src={clip} alt="clip" width="15px" />
                </label>
                <div class="button d-flex flex-column">
                  <button class="btn-add-product" type="submit">
                    Update Topping
                  </button>
                  <div class="btn-backed d-flex justify-content-between">
                    <div></div>
                    <Link to="/admin/topping" className="text-decoration-none">
                      <div className="btn-back mt-3">Back</div>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
            <div class="col-md-5 d-flex justify-content-center align-items-center">
              <img src={detailTopping?.image} alt="coffee" className="img-upload" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateTopping;
