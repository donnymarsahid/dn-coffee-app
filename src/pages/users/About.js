import React, { useState } from "react";
import assetOne from "../../assets/img/about-1.png";
import assetTwo from "../../assets/img/about-2.png";

const About = () => {
  return (
    <>
      <title>WaysBucks | About</title>

      <section className="about-store-page">
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h3>MISSION</h3>
            <p className="lead">
              Our mission is to spread our passion for high quality <br /> coffee from Indonesia to the rest of Asia.
            </p>
          </div>
        </div>
        <div class="content">
          <div class="container">
            <div class="row">
              <div class="col-md-5">
                <img src={assetOne} alt="waysbucks" className="img-fluid" />
              </div>
              <div class="col-md-7">
                <h3>ONE OF THE BRAND IN JAKARTA CITY</h3>
                <p>
                  waybucks is a coffee selling business located in Jakarta which was established in 2021, waybucks provides various kinds of coffee and toppings, waybucks
                  can be accessed through the website or come to the store, and accept delivery orders.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="container">
            <div class="row flex-row-reverse">
              <div class="col-md-5">
                <img src={assetTwo} alt="waysbucks" className="img-fluid" />
              </div>
              <div class="col-md-7">
                <h3>COFFEE JOURNEY</h3>
                <p className="pe-3">
                  At WaysBucks, we make sure you have the best coffee experience. We work relentlessly to guarantee we deliver on our promise. From harvest, tasting,
                  roasting and working together with the producers in Indonesia to produce the best crop to our customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
