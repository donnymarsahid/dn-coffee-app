import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import convertRupiah from 'rupiah-format';
import { API, getProducts } from '../../../../config/api';
import swal from 'sweetalert';

const TableProduct = () => {
  const { data: products, refetch } = useQuery('productsCache', getProducts);

  const handlerDelete = useMutation(async (id) => {
    try {
      const config = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + localStorage.token,
        },
      };

      swal({
        title: 'Are you sure?',
        text: 'product will be deleted',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await API().delete('/product/' + id, config);
          refetch();
          swal('Product has been deleted!', {
            icon: 'success',
          });
        } else {
          swal('Product is safe!');
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <title>DNcoffee | Product</title>
      <section className="income-transaction">
        <div class="container">
          <div class="title d-flex justify-content-between align-items-center">
            <h1 className="mb-3">Product</h1>
            <Link to="/admin/product/add-product" className="text-decoration-none">
              <button class="added d-flex align-items-center">add product</button>
            </Link>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Image</th>
                <th scope="col">Title</th>
                <th scope="col">TypeCoffee</th>
                <th scope="col">Price</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product, index) => {
                return (
                  <tr>
                    <td scope="col">{index + 1}</td>
                    <td scope="col" className="d-flex justify-content-center">
                      <img src={product.image} alt={product.image} />
                    </td>
                    <td scope="col">{product.title}</td>
                    <td scope="col">{product.typeCoffee}</td>
                    <td scope="col">{convertRupiah.convert(product.price)}</td>
                    <td scope="col">{product.status}</td>
                    <td scope="col" className="action">
                      <Link to={`/admin/update-product/${product.id}`}>
                        <button className="me-2">Edit</button>
                      </Link>
                      <button
                        className="trash"
                        onClick={() => {
                          handlerDelete.mutate(product.id);
                        }}
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default TableProduct;
