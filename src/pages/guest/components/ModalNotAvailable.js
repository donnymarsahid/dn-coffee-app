import React from 'react';

const ModalNotAvailable = () => {
  return (
    <div>
      <div class="modal fade" id="exampleModalNotAvailable" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center" style={{ color: '#00959C', fontWeight: '500', fontSize: '18px' }}>
              This product is currently unavailable
            </div>
            <div class="modal-footer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNotAvailable;
