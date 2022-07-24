import React, { useState } from "react";
import "./css/style.css";
import { useQuery } from "react-query";
import { getWishlistUser } from "../../config/api";
import loading from "../../assets/img/loading.gif";
import ModalNotAvailable from "../guest/components/ModalNotAvailable";
import CardWishlist from "./cardsProducts/CardWishlist";
import noData from "../../assets/img/nodata.svg";

const Wishlist = () => {
  const { data: wishlist, isLoading, error, refetch } = useQuery("wishlistCache", getWishlistUser);

  if (isLoading) {
    return (
      <div className="custom-status">
        <img src={loading} alt="load" width="100px" />
      </div>
    );
  }

  if (error) return <div className="custom-status">Error fetching data</div>;

  if (wishlist?.length === 0) {
    return (
      <>
        <title>DNcoffee | Cart</title>
        <section className="cart-page-null d-flex align-items-center justify-content-center flex-column">
          <img src={noData} alt="empty-cart" width="150px" />
          <p className="txt-wishlist">No Wishlist</p>
        </section>
      </>
    );
  }

  return (
    <>
      <title>DNcoffee | Wishlist</title>
      <section className="all-menu varian">
        <div className="container">
          <div class="title d-flex justify-content-between mb-3">
            <h3>Wishlist</h3>
          </div>
          <div className="row">
            {wishlist?.map((data) => {
              return <CardWishlist coffee={data.product} key={data.id} refetch={refetch} />;
            })}
          </div>
        </div>
      </section>
      <ModalNotAvailable />
    </>
  );
};

export default Wishlist;
