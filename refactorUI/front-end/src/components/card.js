import React from "react";
import "../pages/nft/style.css";

const Card = () => {
  return (
    <div className="product-style-one">
      <div className="card-thumbnail">
        
          <img src="https://www.nftinvesting.io/content/images/2021/05/nft-projects.png" alt="NFT_portfolio" />
      
      </div>
      <div className="product-share-wrapper">
       
        <div className="share-btn share-btn-activation dropdown">
       
          <div className="share-btn-setting dropdown-menu dropdown-menu-end">
            <button
              type="button"
              className="btn-setting-text share-text"
              data-bs-toggle="modal"
              data-bs-target="#shareModal"
            >
              Share
            </button>
            
          </div>
        </div>
      </div>
      <a href="product-details.html">
        <span className="product-name">Preatent</span>
      </a>
      <span className="latest-bid">Highest bid 1/20</span>
      <div className="bid-react-area">
        <div className="last-bid">0.244ShieldPact</div>
        <div className="react-area">
          <svg
            viewBox="0 0 17 16"
            fill="none"
            width="16"
            height="16"
            className="sc-bdnxRM sc-hKFxyN kBvkOu"
          >
            <path
              d="M8.2112 14L12.1056 9.69231L14.1853 7.39185C15.2497 6.21455 15.3683 4.46116 14.4723 3.15121V3.15121C13.3207 1.46757 10.9637 1.15351 9.41139 2.47685L8.2112 3.5L6.95566 2.42966C5.40738 1.10976 3.06841 1.3603 1.83482 2.97819V2.97819C0.777858 4.36443 0.885104 6.31329 2.08779 7.57518L8.2112 14Z"
              stroke="currentColor"
              strokeWidth="2"
            ></path>
          </svg>
          <span className="number">322</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
