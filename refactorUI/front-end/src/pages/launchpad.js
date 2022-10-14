import React from "react";
import "./launchpad.css";
import image from "./20220921_104004.png"
import CreateTokenModal from "../components/createTokenModal";
import { useState } from "react";

const Container = () => {
  const [displayTokenModal, setDisplayTokenModal] = useState(false);
  return (
    <div>
      <section class="--full-page">
        <main>
          <section>
            <div class="staking-cont">
              <h1 class="head">LaunchPad</h1>
              <div class="stake">
                <div class="left">
                  <div class="img">
                    <img src={image} alt="" />
                  </div>
                  <div class="text">
                    <h4>SHIEDLCOIN GOLD TOKEN (SHIELDGOLD)</h4>
                    <h5>1 SHIELDGOLD = 0.538 SHIELD COIN</h5>
                    <p>
                      <span>Offering Starts</span>: Thu, Jul 21, 2022, 4:00 PM
                      UTC
                    </p>
                    <p>
                      <span>Offering Ends</span>: Tue, Jul 26, 2022, 4:00 PM UTC
                    </p>
                    <p>
                      <span>Claim Starts</span>: Wed, Jul 27, 2022, 4:00 PM UTC
                    </p>
                    <div class="progress">
                      <progress max="100" value="119"></progress>
                      <p id="progress">110%</p>
                    </div>
                    <p>Total Raised: 6,408,554.575 SHIELDCOIN</p>
                  </div>
                </div>
                <div class="action">
                  <div class="txt">
                    <div class="row">
                      <div>
                        <span>Target Raise Amount</span>
                        <p>5,380,000 SHIELDCOIN</p>
                      </div>
                      <div>
                        <span>Target Offer Amount</span>
                        <p>10,000,000 SHIELDCOIN</p>
                      </div>
                    </div>
                    <div class="row">
                      <div>
                        <span>My Deposit Amount</span>
                        <p>SHIELDCOIN</p>
                      </div>
                      <div>
                        <span>Claim Amount</span>
                        <p>SHIELDGOLD</p>
                      </div>
                      <div>
                        <span>Refund Amount</span>
                        <p>SHIELDCOIN</p>
                      </div>
                    </div>
                  </div>
                  <div class="claim">
                    <button id="btn" class="btn">Claim & Refund</button>
                  </div>
                </div>
              </div>
              <div class="stake">
                <div class="left">
                  <div class="img">
                    <img src={image} alt="" />
                  </div>
                  <div class="text">
                    <h4>SHIEDLCOIN GOLD TOKEN (SHIELDGOLD)</h4>
                    <h5>1 SHIELDGOLD = 0.538 SHIELD COIN</h5>
                    <p>
                      <span>Offering Starts</span>: Thu, Jul 21, 2022, 4:00 PM
                      UTC
                    </p>
                    <p>
                      <span>Offering Ends</span>: Tue, Jul 26, 2022, 4:00 PM UTC
                    </p>
                    <p>
                      <span>Claim Starts</span>: Wed, Jul 27, 2022, 4:00 PM UTC
                    </p>
                    <div class="progress">
                      <progress max="100" value="119"></progress>
                      <p id="progress">110%</p>
                    </div>
                    <p>Total Raised: 6,408,554.575 SHIELDCOIN</p>
                  </div>
                </div>
                <div class="action">
                  <div class="txt">
                    <div class="row">
                      <div>
                        <span>Target Raise Amount</span>
                        <p>5,380,000 SHIELDCOIN</p>
                      </div>
                      <div>
                        <span>Target Offer Amount</span>
                        <p>10,000,000 SHIELDCOIN</p>
                      </div>
                    </div>
                    <div class="row">
                      <div>
                        <span>My Deposit Amount</span>
                        <p>SHIELDCOIN</p>
                      </div>
                      <div>
                        <span>Claim Amount</span>
                        <p>SHIELDGOLD</p>
                      </div>
                      <div>
                        <span>Refund Amount</span>
                        <p>SHIELDCOIN</p>
                      </div>
                    </div>
                  </div>
                  <div class="claim">
                    <button id="btn" class="btn">Claim & Refund</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="token">
            <div className="head">
              <h3>Token address</h3>
              <button onClick={()=>setDisplayTokenModal(true)} className="btn">Create Token</button>
            </div>
            <input type="text" placeholder="Ex: PinkMoon" />
            <div className="currency">
              <h3>Currency</h3>
              
              <label htmlFor="bnb"><input type="radio" id="bnb" name="currency"/>BNB</label>
              
              <label htmlFor="busd"><input type="radio" id="busd" name="currency"/>BUSD</label>
            </div>
            <div className="currency">
              <h3>Fee Options</h3>
              
              <label htmlFor="first"><input type="radio" id="first" name="fee"/>5% BUSD raised only (Recommended)</label>
              
              <label htmlFor="second"><input type="radio" id="second" name="fee"/>2% BUSD raised + 2% token sold</label>
            </div>
            <div className="currency">
              <h3>Listing Options</h3>
              
              <label htmlFor="auto"><input type="radio" id="auto" name="listing"/>Auto Listing</label>
              
              <label htmlFor="manual"><input type="radio" id="manual" name="listing"/>Manual Listing</label>
            </div>
          </section>
        </main>

      </section>
      {displayTokenModal && <CreateTokenModal removeModal={()=>setDisplayTokenModal(false)}/>}
    </div>
  );
};

export default Container;
