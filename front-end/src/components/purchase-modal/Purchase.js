import React from "react";
import "./purchase.css";

const Purchase = () => {
    function increment() {
        document.getElementById('qty').stepUp();
     }
     function decrement() {
        document.getElementById('qty').stepDown();
     }
  return (
    <div className="product-modal-bg">
      <div className="product-modal">
        <div className="prod-image">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY0nDzdLAr5cBqSpIRLD603fI-ZmkWM1db2g&usqp=CAU"
            alt=""
          />
        </div>
        <div className="prod-info">
          <div className="name-author">
            <h1>NYT</h1>
            <p>By Lorem Ipsum</p>
          </div>
          <div className="flex-prod">
            <div className="price">
              <h4>PRICE</h4>
              <h2>500 SHIELD</h2>
            </div>
            {/* <div className="qty">
              <h4>QUANTITY</h4>
              <div className="inp">
                <input id="qty" type="number" min={0} value={0} />
                <button onClick={()=>increment()}>+</button>
                <button onClick={()=>decrement()}>-</button>
              </div>
              <p>Max Quantity: 7</p>
            </div> */}
          </div>
          <div className="desc">
            <h4>DESCRIPTION</h4>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus,
              quia facere! Reiciendis molestias, dignissimos quae in
              necessitatibus saepe eum quaerat cupiditate, quia autem corrupti,
              vitae non. Libero placeat accusantium repellat.
            </p>
          </div>
          <button className="btn">Purchase NFT</button>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
