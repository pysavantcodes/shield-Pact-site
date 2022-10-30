import React from "react";


const PurchaseSuccess = () => {
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
          <h4 style={{marginBottom:"1rem"}}>NFT Purchased Successfully</h4>
          {/* <p>1.23 BNB &#x2192; 4,234.3 SHIELD</p> */}
        </div>
        <button>Close</button>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
