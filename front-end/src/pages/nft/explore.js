import React from "react";
import Card from "../../components/card";
import "./style.css";

const NFTExplore = () => {
  return (
    <div className="body">
      <div>
        <h1>Explore NFT</h1>
        {/* Filter Section */}
        <div className="default-exp-wrapper default-exp-expand">
          <div className="inner">
            <div className="filter-select-option">
              <label className="filter-leble">LIKES</label>
              <select>
                <option data-display="Most liked">Most liked</option>
                <option value="1">Least liked</option>
              </select>
            </div>

            <div className="filter-select-option">
              <label className="filter-leble">Category</label>
              <select>
                <option data-display="Category">Category</option>
                <option value="1">Art</option>
                <option value="1">Photograph</option>
                <option value="2">Metaverses</option>
                <option value="4">Potato</option>
                <option value="4">Photos</option>
              </select>
            </div>

            <div className="filter-select-option">
              <label className="filter-leble">Collections</label>
              <select>
                <option data-display="Collections">Collections</option>
                <option value="1">BoredApeYachtClub</option>
                <option value="2">MutantApeYachtClub</option>
                <option value="4">Art Blocks Factory</option>
              </select>
            </div>

            <div className="filter-select-option">
              <label className="filter-leble">Sale type</label>
              <select>
                <option data-display="Sale type">Sale type</option>
                <option value="1">Fixed price</option>
                <option value="2">Timed auction</option>
                <option value="4">Not for sale</option>
                <option value="4">Open for offers</option>
              </select>
            </div>

            <div className="filter-select-option">
              <label className="filter-leble">Starting Price</label>
              <div className="price_filter s-filter clear">
                <form action="#" method="GET">
                  <div id="slider-range"></div>
                  <div className="slider__range--output">
                    <div className="price__output--wrap">
                      <div className="price--output">
                        <input
                          placeholder="20.00"
                          type="text"
                          id="amount"
                          readonly
                        />
                      </div>
                      <div className="price--filter">
                        <button className="btn btn-primary btn-small">
                          Filter
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="product-grid">
            <Card />
            <Card />
            <Card />

            <Card />
            <Card />
          </div>
      </div>
    </div>
  );
};

export default NFTExplore;
