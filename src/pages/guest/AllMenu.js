import React, { useState } from 'react';
import Login from '../access/Login';
import Register from '../access/Register';
import CardAllCoffee from './cardsProducts/CardAllCoffee';
import CardCoffee from './cardsProducts/CardCoffe';
import './css/style.css';
import { useQuery } from 'react-query';
import { getProducts, getTypeCoffee } from '../../config/api';
import loading from '../../assets/img/loading.gif';

const AllMenu = () => {
  const { data: products, isLoading, error } = useQuery('productsCache', getProducts);
  const { data: typeCoffee, isLoading: loadTypeCoffee, error: errorTypeCoffee } = useQuery('typeCoffeeCache', getTypeCoffee);
  const [renderCoffee, setRenderCoffee] = useState(true);
  const [title, setTitle] = useState('All Menu');

  if (isLoading || loadTypeCoffee) {
    return (
      <div className="custom-status">
        <img src={loading} alt="load" width="100px" />
      </div>
    );
  }

  if (error) return <div className="custom-status">Error fetching data</div>;

  return (
    <>
      <title>WaysBucks | All Menu</title>
      <section className="all-menu varian">
        <div className="container">
          <div class="title d-flex justify-content-between mb-3">
            <h3>{title}</h3>
            <div class="dropdown">
              <button class="btn-sort-by dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Sort By
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() => {
                      setTitle('All Menu');
                      setRenderCoffee(true);
                    }}
                  >
                    All Menu
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() => {
                      setTitle('Coffee Variant');
                      setRenderCoffee(false);
                    }}
                  >
                    Coffee Variant
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="row">{renderCoffee ? products?.map((data) => <CardAllCoffee coffee={data} key={data.id} />) : typeCoffee?.map((data) => <CardCoffee coffee={data} key={data.id} />)}</div>
        </div>
      </section>
      <Login />
      <Register />
    </>
  );
};

export default AllMenu;
