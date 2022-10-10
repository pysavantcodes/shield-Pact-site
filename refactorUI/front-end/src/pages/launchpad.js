import React from "react";
import "./launchpad.css";
import image from "./20220921_104004.png"

const Container = () => {
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
        </main>
      </section>
      {/* <section class="bottom-nav">
        <div onclick="swapPage()" class="swap">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            <p>Swap</p>

        </div>
        <div class="nft">
            <a style="color: white;text-decoration:none;" href="/nftpage/index.html">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-codesandbox"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                <p>NFT</p>
            </a>

        </div>
        <div onclick="homePage()" class="home">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layout"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            <p>Home</p>
        </div>
        <div onclick="stakingPage()" class="staking">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-database"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
            <p>Staking</p>

        </div>
        <div onclick="launchPage()" class="launch active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            <p>LaunchPad</p>

        </div>

    </section> */}
    </div>
  );
};

export default Container;
