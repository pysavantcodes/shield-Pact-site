import React from "react";
import "./style.css";
import img from "./Restorer-amico (1).png";
import Card from "../../components/card";

const Container = () => {
  return (
    <div className="body">
      <div className="slider-one rn-section-gapTop">
        <div className="container">
          <div>
            <div className="txt">
              <h2 className="title">
                Discover Digital Art, Collect and Sell Your Specific NFTs.
              </h2>
              <p className="slide-disc">
                Partner with one of the world’s largest retailers to showcase
                your brand and products.
              </p>
              <div className="button-group">
                <button className="btn">Create NFT</button>
              </div>
            </div>
          </div>
          <div className="img">
            <img src={img} alt="Slider Images" />
          </div>
        </div>
      </div>

      <div className="rn-live-bidding-area rn-section-gapTop">
        <div>
          <h3 className="title">Live Bidding</h3>
          <div className="product-grid">
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
      </div>

      <div className="rn-new-items rn-section-gapTop">
        <div>
          <div className="row mb--50 align-items-center">
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <h3
                className="title mb--0"
                data-sal-delay="150"
                data-sal="slide-up"
                data-sal-duration="800"
              >
                Newest Items
              </h3>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt_mobile--15">
              <div
                className="view-more-btn text-start text-sm-end"
                data-sal-delay="150"
                data-sal="slide-up"
                data-sal-duration="800"
              >
                <a className="btn-transparent" href="#">
                  VIEW ALL<i data-feather="arrow-right"></i>
                </a>
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

      <div className="rn-product-area rn-section-gapTop">
        <div>
          <div className="row mb--50 align-items-center">
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <h3
                className="title mb--0"
                data-sal-delay="150"
                data-sal="slide-up"
                data-sal-duration="800"
              >
                Explore Product
              </h3>
            </div>
            
          </div>

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
                          
                          <input placeholder="20.00" type="text" id="amount" readonly />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
