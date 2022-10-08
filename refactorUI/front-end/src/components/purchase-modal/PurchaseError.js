import React from "react";


const PurchaseError = () => {
  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="txt-center">
          <div className="image">
            <img
              src="https://freesvg.org/img/DynV-Warning-sign-1.png"
              alt=""
            />
          </div>
          <h4>Something went wrong in the process.</h4>
          <p>Try increasing your slippage fee. <br /> Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <button>Dismiss</button>
      </div>
    </div>
  );
};

export default PurchaseError;
