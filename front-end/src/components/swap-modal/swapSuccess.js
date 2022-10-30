import React from "react";
import "./swap.css";

const SwapSuccess = () => {
  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="txt-center">
          <div className="image">
            <img
              src="https://wasiyyah.com.au/wp-content/uploads/2021/04/check-1.svg"
              alt=""
            />
          </div>
          <h4>Transaction Submitted</h4>
          <p>1.23 BNB &#x2192; 4,234.3 SHIELD</p>
        </div>
        <button>Close</button>
      </div>
    </div>
  );
};

export default SwapSuccess;
