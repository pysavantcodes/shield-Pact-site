import React from "react";


const PurchaseLoading = () => {
  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="txt-center">
          <div className="image">
            <img
              src="https://i2.wp.com/raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator.gif?w=770&is-pending-load=1#038;ssl=1"
              alt=""
            />
          </div>
          <h4>Purchasing NFT....</h4>
          <p>Loading. Please wait.</p>
        </div>
        <button disabled>Close</button>
      </div>
    </div>
  );
};

export default PurchaseLoading;
