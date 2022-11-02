import React from "react";
import "./swap.css";

const SwapError = () => {
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
          <h4>Something went wrong</h4>
          <p>Try increasing your slippage fee. <br /> Note: fee on transfer and rebase tokens are incompatible with shield swap.</p>
        </div>
        <button>Dismiss</button>
      </div>
    </div>
  );
};

export default SwapError;
