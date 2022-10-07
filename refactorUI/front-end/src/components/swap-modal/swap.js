import React from "react";
import "./swap.css";
import { MdSwapVert } from "react-icons/md";

const Swap = () => {
  return (
    <div className="modal-bg">
      <div className="modal">
        <h3>Swap</h3>
        <div className="swap-top">
          <div className="text">
            <input type="number" />
            <p>$4,307.23</p>
          </div>
          <div className="token">
            <img src="https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png" />
            <p>BNB</p>
          </div>
        </div>
        <div className="swap-icon">
          <div>
            <MdSwapVert fontSize={30} color="white" />
          </div>
        </div>
        <div className="swap-bottom">
          <p>For</p>
          <div className="sec">
            <div className="text">
              <input type="number" />
              <p>$4,307.23 (-0.117%)</p>
            </div>
            <div className="token">
              <img src="https://i0.wp.com/thedefizone.com/wp-content/uploads/2022/06/croppedShieldCoin.png?fit=380%2C377&ssl=1" />
              <p>SHIELD</p>
            </div>
          </div>
          <br />
          <p id="price">1 BNB = 430.30 SHIELD</p>
          <button>Review Swap</button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
