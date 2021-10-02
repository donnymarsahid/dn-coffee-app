import React from "react";
import convertRupiah from "rupiah-format";

const CardCoffe = ({ coffee, handleShowLogin }) => {
  const parsingPrice = convertRupiah.convert(coffee.price);

  return (
    <>
      <div className="col-md-3 mb-3">
        <div className="box-card">
          <div className="image-card">
            <img src={coffee.image} alt={coffee.image} />
            <div className="overlay d-flex justify-content-center align-items-center">
              {coffee.status === "not available" ? (
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalNotAvailable"
                >
                  Not Available
                </button>
              ) : (
                <button data-bs-toggle="modal" onClick={handleShowLogin}>
                  ORDER NOW
                </button>
              )}
            </div>
          </div>
          <div className="description">
            <div class="title d-flex">
              {coffee.status === "not available" ? (
                <h5 className="text-decoration-line-through text-capitalize">
                  {coffee.title}
                </h5>
              ) : (
                <h5 className="text-capitalize">{coffee.title}</h5>
              )}
              {coffee.status === "not available" ? (
                <p className="title-status ps-2">*{coffee.status}</p>
              ) : (
                <></>
              )}
            </div>
            <p>{parsingPrice}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardCoffe;
