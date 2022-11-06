import React from "react";
import {FaEllipsisV} from "react-icons/fa";
import "../pages/nft/style.css";

const Card = ({itemId, name, description, image, forSale, price, owner, isBNB, userAddress, onClick}) => {
  const isOwner = owner && owner === userAddress;
  
  return (
    <div className="product-style-one">
      <div className="card-thumbnail">
        
          <img style={{height:"280px"}} src={image} alt="NFT_portfolio" />
      
      </div>
      <div className="product-share-wrapper">
       
        <div className="share-btn share-btn-activation dropdown">
       
          <div className="share-btn-setting dropdown-menu dropdown-menu-end">
            <button
              type="button"
              style={{padding:'0.25rem'}}
              className="btn-setting-text"
              data-bs-toggle="modal"
              data-bs-target="#shareModal"
             onClick={onClick({isOwner,itemId, forSale, price, isBNB, name, description})}>
              <FaEllipsisV style={{fontSize:'1.5rem'}}/>
            </button>
            
          </div>
        </div>
      </div>
      <a href="javascript:void(0)">
        <span className="product-name">{name}</span>
      </a>
      <span className="latest-bid">{forSale?"For Sale":'Not For Sale'}</span>
      <div className="bid-react-area">
        <div className="last-bid">{price||'??.??'}{isBNB?'BNB':'BUSD'}</div>
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
          <span className="number">{isOwner&&"Owned"}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
