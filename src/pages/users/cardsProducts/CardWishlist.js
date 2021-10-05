import React from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import convertRupiah from "rupiah-format";
import { API } from "../../../config/api";

const CardWishlist = ({ coffee, refetch }) => {
  const parsingPrice = convertRupiah.convert(coffee.price);

  const deleteWishlist = useMutation(async (id) => {
    try {
      const config = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      };

      const response = await API().delete("/wishlist/" + id, config);
      console.log(response);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <div className="col-md-3 mb-4">
        <div className="box-card">
          <div className="image-card">
            <img src={`${coffee.image}`} alt={coffee.image} />
            <div className="overlay d-flex justify-content-center align-items-center">
              {coffee.status === "not available" ? (
                <button data-bs-toggle="modal" data-bs-target="#exampleModalNotAvailable">
                  Not Available
                </button>
              ) : (
                <Link to={`/detail-page/${coffee.id}`}>
                  <button>ORDER NOW</button>
                </Link>
              )}
            </div>
            <div className="whistlist d-flex align-items-center justify-content-center" onClick={() => deleteWishlist.mutate(coffee.id)}>
              <button className="click-whistlist">
                <i className="far fa-heart "></i>
              </button>
            </div>
          </div>
          <div className="description">
            <div class="title d-flex">
              {coffee.status === "not available" ? (
                <h5 className="text-decoration-line-through text-capitalize">{coffee.title}</h5>
              ) : (
                <h5 className="text-capitalize">{coffee.title}</h5>
              )}
              {coffee.status === "not available" ? <p className="title-status ps-2">*{coffee.status}</p> : <></>}
            </div>
            <p>{parsingPrice}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardWishlist;
