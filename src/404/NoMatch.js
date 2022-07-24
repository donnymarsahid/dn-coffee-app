import React from 'react';

const NoMatch = () => {
  if (!localStorage.token) {
    return <div className="custom-status">Loading</div>;
  }
  return (
    <>
      <div class="nomatch d-flex align-items-center flex-column justify-content-center" style={{ height: '100vh' }}>
        <h2 style={{ color: '#00959C' }} className="fw-bolder"></h2>
      </div>
    </>
  );
};

export default NoMatch;
