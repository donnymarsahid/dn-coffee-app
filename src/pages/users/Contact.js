import React from "react";

const Contact = () => {
  return (
    <>
      <title>DNcoffee | Contact</title>
      <div class="page-contact d-flex align-items-center justify-content-center flex-column">
        <h3>Any Question ?</h3>
        <p>Contact us via</p>
        <div class="email d-flex flex-column border-lg">
          <i class="fas fa-envelope text-center"></i>
          <a href="mailto:waysbucks.coffee@gmail.com" class="ms-2">
            dn.coffee@gmail.com
          </a>
        </div>
        <div class="telp d-flex flex-column border-lg">
          <i class="fab fa-whatsapp text-center"></i>
          <a
            href="https://api.whatsapp.com/send?phone=6283872239021&text=Hallo%20Donny"
            class="ms-2"
            target="blank"
          >
            Click Here!
          </a>
        </div>
      </div>
    </>
  );
};

export default Contact;
