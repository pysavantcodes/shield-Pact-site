import React from "react";
import "./launchpad.css";
import image from "./20220921_104004.png";
import CreateTokenModal from "../components/createTokenModal";
import { useState } from "react";
import * as Fa from "react-icons/fa";

const Container = () => {
  // const [displayTokenModal, setDisplayTokenModal] = useState(false);
  return (
    <div className="launchpad">
      <section class="--full-page">
        <div className="launchpadInfoContainer">
          <h1>LaunchPad Info</h1>
          <label htmlFor="rate">
            Presale Rate
            <input id="rate" type="text" placeholder="200" />
            <p>If i spend 1BNB how many tokens will i receive?</p>
          </label>
          <label htmlFor="whitelist">Whitelist</label>
          <label htmlFor="disable">
            <input type="radio" id="disable" name="whitelist" />
            Disable
          </label>

          <label htmlFor="enable">
            <input type="radio" id="enable" name="whitelist" />
            Enable
          </label>
          <p>You can enable/disable whitelist</p>
          <br />

          <label htmlFor="softcap">
            Soft Cap (BNB)
            <input type="text" id="softcap" placeholder="500" />
            <p>Soft cap must be >= 50% of HardCap</p>
          </label>
          <label htmlFor="hardcap">
            Hard Cap (BNB)
            <input type="text" id="hardcap" placeholder="500" />
          </label>
          <label htmlFor="minbuy">
            Minimum Buy (BNB)
            <input type="text" id="minbuy" placeholder="0.01" />
          </label>
          <label htmlFor="maxbuy">
            Maximum Buy (BNB)
            <input type="text" id="maxbuy" placeholder="0.1" />
          </label>
          <label htmlFor="reftype">
            Maximum Buy (BNB)
            <select name="reftype">
              <option value="Bum">Bum</option>
            </select>
          </label>
          <label htmlFor="router">
            Router
            <select name="router">
              <option value="Bum">PancakeSwap</option>
            </select>
          </label>
          <label htmlFor="liquidity">
            Pancake Swap Liquidity (%)
            <input type="text" id="liquidity" placeholder="80" />
          </label>
          <label htmlFor="time">
            Select Start Time and End Time (UTC)
            <label htmlFor="start">
              Start time (UTC)
              <input type="datetime-local" id="start" />
            </label>
            <label htmlFor="end">
              End time (UTC)
              <input type="datetime-local" id="end" />
            </label>
          </label>
          <label htmlFor="lockup">
            Liquidity Lockup (days)
            <input type="text" id="lockup" placeholder="30" />
          </label>
          <label htmlFor="contributor">
            <input type="checkbox" id="contributor" />
            Using vesting Contributor ?
          </label>
          <p>Need 321,600 PresaleTestToken to create launchpad</p>
          <div className="buttons">
            <button className="btn-border">Back</button>
            <button className="btn">Next</button>
          </div>
        </div>
        <div className="launchpadInfoContainer">
          <h1>LaunchPad Additional Info</h1>
          <label htmlFor="logo">
            Logo Url
            <input
              id="logo"
              type="text"
              placeholder="https://ping.jrel/img.png"
            />
            <p>
              Url must end with image supported extensions
              (.png,.jpg,.gif,.jpeg){" "}
            </p>
          </label>

          <label htmlFor="fb">
            Facebook
            <input
              type="text"
              id="fb"
              placeholder="https://facebook.com/user"
            />
          </label>
          <label htmlFor="twitter">
            Twitter
            <input
              type="text"
              id="twitter"
              placeholder="https://twitter.com/user"
            />
          </label>
          <label htmlFor="github">
            Github
            <input
              type="text"
              id="github"
              placeholder="https://github.com/user"
            />
          </label>
          <label htmlFor="telegram">
            Telegram
            <input
              type="text"
              id="telegram"
              placeholder="https://telegram.com/user"
            />
          </label>
          <label htmlFor="instagram">
            Instagram
            <input
              type="text"
              id="instagram"
              placeholder="https://instagram.com/user"
            />
          </label>
          <label htmlFor="discord">
            Discord
            <input
              type="text"
              id="discord"
              placeholder="https://discord.com/user"
            />
          </label>
          <label htmlFor="reddit">
            Reddit
            <input
              type="text"
              id="reddit"
              placeholder="https://reddit.com/user"
            />
          </label>
          <label htmlFor="desc">
            Description
            <textarea id="desc" rows="6" placeholder="Describe the token..." />
          </label>
          <div className="buttons">
            <button className="btn-border">Back</button>
            <button className="btn">Next</button>
          </div>
        </div>
        <div className="launchpadInfoContainer">
          <h1>Token Presale</h1>
          <div className="presale">
            <div className="name-icon">
              <img src="https://assets.coingecko.com/coins/images/1060/large/icon-icx-logo.png?1547035003" />
              <h4>PresaleTestToken Presale</h4>
            </div>
            <div className="ics">
              <Fa.FaFacebook id="ic" />
              <Fa.FaInstagram id="ic" />
              <Fa.FaTwitter id="ic" />
              <Fa.FaGithub id="ic" />
              <Fa.FaDiscord id="ic" />
              <Fa.FaTelegram id="ic" />
              <Fa.FaReddit id="ic" />
            </div>
            <p>
              PinkSale helps everyone to create their own token sales in few
              seconds. Tokens created in pinksale will be verified and published
              on explorer website
            </p>
            <ul>
              <li>
                <p>Presale Address</p>
                <span>0xniebf38ee21hb83rh80erh32</span>
              </li>
              <li>
                <p>Token Name</p>
                <span>PresaleTestToken</span>
              </li>
              <li>
                <p>Token Symbol</p>
                <span>PresaleTestToken</span>
              </li>
              <li>
                <p>Token Decimals</p>
                <span>18</span>
              </li>
              <li>
                <p>Token Address</p>
                <span>0xjeie8h21rh23h8r23b289t92tg42</span>
              </li>
              <li>
                <p>Total Supply</p>
                <span>1,000,000 PinkSaleTestToken</span>
              </li>
              <li>
                <p>Token for Presale</p>
                <span>200,000 PinkSaleTestToken</span>
              </li>
              <li>
                <p>Token for Liquidity</p>
                <span>120,000 PinkSaleTestToken</span>
              </li>
              <li>
                <p>Presale Rate</p>
                <span>1BNB = 200 PinkSaleTestToken</span>
              </li>
              <li>
                <p>Listing Rate</p>
                <span>1BNB = 150 PinkSaleTestToken</span>
              </li>
              <li>
                <p>Soft Cap</p>
                <span>500 BNB</span>
              </li>
              <li>
                <p>Hard Cap</p>
                <span>1,000 BNB</span>
              </li>
              <li>
                <p>Unsold Tokens</p>
                <span>Burn</span>
              </li>
              <li>
                <p>Presale Start Time</p>
                <span>2022.05.01 16:34(UTC)</span>
              </li>
              <li>
                <p>Presale End Time</p>
                <span>2022.05.01 16:34(UTC)</span>
              </li>
              <li>
                <p>Listing On</p>
                <span>
                  <a href="#">Pankcakeswap</a>
                </span>
              </li>
              <li>
                <p>Liquidity Percent</p>
                <span>80%</span>
              </li>
              <li>
                <p>Liquidity Lockup Time</p>
                <span>365 minutes after pool ends.</span>
              </li>
            </ul>
          </div>

          <div className="start">
            <p>Presale starts in</p>
            <div>
              <p>01</p>
              <p>23</p>
              <p>49</p>
              <p>22</p>
            </div>
            <progress value={0} max={1000} />
            <div className="progval">
              <p>0BNB</p>
              <p>1000BNB</p>
            </div>
            <label htmlFor="amount">
              Amount(max: 0.1 BNB)
              <input type="text" id="amount" placeholder="0.0" />
            </label>
            <button className="btn">Buy with BNB</button>
            <ul>
              <li>
                <p>Status</p>
                <span>Incoming</span>
              </li>
              <li>
                <p>Sale Type</p>
                <span>Public</span>
              </li>
              <li>
                <p>Minimum Buy</p>
                <span>0.01 BNB</span>
              </li>
              <li>
                <p>Maximum Buy</p>
                <span>0.1 BNB</span>
              </li>
              <li>
                <p>You Purchased</p>
                <span>0 BNB</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="launchpadInfoContainer">
          <h1>Launched Token View</h1>

          <div className="tokenhead">
            <img src="https://assets.coingecko.com/coins/images/1060/large/icon-icx-logo.png?1547035003" />

            <div className="ri">
              <h4>BSCPAD</h4>
              <div className="ics">
                <Fa.FaFacebook id="ic" />
                <Fa.FaInstagram id="ic" />
                <Fa.FaTwitter id="ic" />
                <Fa.FaGithub id="ic" />
                <Fa.FaDiscord id="ic" />
                <Fa.FaTelegram id="ic" />
                <Fa.FaReddit id="ic" />
              </div>
              <div className="details">
                <p className="wallet">Closed</p>
                <p className="wallet">BUSD</p>
              </div>
            </div>
          </div>
          <p style={{ fontSize: "16px" }}>
            BSCPAD is the first launchpad dedicated to launching projects on
            binance smart chain
          </p>
          <div className="rates">
            <div>
              <span>Swap Rate</span>
              <p>1 BUSD = 50 BSCPAD </p>
            </div>
            <div>
              <span>Cap</span>
              <p>525000 </p>
            </div>
            <div>
              <span>Access</span>
              <p>Private </p>
            </div>
          </div>
          <div className="progvalup">
            <span>Progress</span>
            <span>Participant <p>1091</p></span> 
          </div>
          <progress value={1000} max={1000} />
          <div className="progval">
            <p>100.00%</p>
            <p>525000.000/525000</p>
          </div>
        </div>
      </section>
      {/* {displayTokenModal && <CreateTokenModal removeModal={()=>setDisplayTokenModal(false)}/>} */}
    </div>
  );
};

export default Container;
