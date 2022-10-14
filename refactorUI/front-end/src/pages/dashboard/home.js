import React from "react";
import "./home.css";
import * as Md from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import FreelancerListModal from "../../components/dashboard/freelancer-list-modal";

const DashboardHome = () => {
  const [displayModal, setDisplayModal] = useState(false);
  

  const displayJobModal = ()=>{
    setDisplayModal(true);
  }
  return (
    <div className="dashhome">
      <div className="head">
        <h1 className="title">
          <span style={{ fontWeight: "500" }}>Hire expert freelancers </span>
          <br />
          for any job, Online
        </h1>
        <p>
          All your Jobs and Services will be handled by experienced freelancers
        </p>
      </div>
      <div className="categories">
        <h2>View Job Categories</h2>
        <div class="taske">
          <div class="service-cont">
            {/* <div class="search">
                <input
                  type="text"
                  placeholder="Search Services"
                  name=""
                  id=""
                />
                <Md.MdSearch id="ic"/>
              </div> */}
            <div class="categories">
              <ul>
                <li onClick={()=>displayJobModal()}>
                  <Md.MdMovie id="ic" />
                  <div>
                    Influencer Content
                    <p>
                      Videos, Pictures, <NavLink to="/nft">NFTs</NavLink>, Music
                    </p>
                  </div>
                </li>
                <li onClick={()=>displayJobModal()}>
                  <Md.MdDraw id="ic" />
                  <div>
                    Graphic & Design
                    <p>Logo & Brand Entity, Art & Illustration</p>
                  </div>
                </li>
                <li onClick={()=>displayJobModal()}>
                  <Md.MdShoppingCart id="ic" />
                  <div>
                    Digital Marketing
                    <p>Social Media Marketing, Social Media Advertising</p>
                  </div>
                </li>
                <li onClick={()=>displayJobModal()}>
                  <Md.MdDocumentScanner id="ic" />
                  <div>
                    Writing & Translation
                    <p>Articles & Blog Posts, Translation, Resume Writing</p>
                  </div>
                </li>
                <li onClick={()=>displayJobModal()}>
                  <Md.MdVideocam id="ic" />
                  <div>
                    Video & Animation
                    <p>Video Editing, Video Ads and Commercial</p>
                  </div>
                </li>
                <li onClick={()=>displayJobModal()}>
                  <Md.MdAudiotrack id="ic" />
                  <div>
                    Music & Audio
                    <p>Voice Over, Producers & Composers</p>
                  </div>
                </li>
                <li onClick={()=>displayJobModal()}>
                  <Md.MdCode id="ic" />
                  <div>
                    Programming & Tech
                    <p>Wordpress, Website Builders & CMS</p>
                  </div>
                </li>
                <li onClick={()=>displayJobModal()}>
                  <Md.MdFileCopy id="ic" />
                  <div>
                    Data
                    <p>Database, Data Processing</p>
                  </div>
                </li>
                <li onClick={()=>displayJobModal()}>
                  <Md.MdAddBusiness id="ic" />
                  <div>
                    Business
                    <p>Virtual Assistant, E-commerce Management</p>
                  </div>
                </li>
                <li onClick={()=>displayJobModal()}>
                  <Md.MdBook id="ic" />
                  <div>
                    Lifestyle
                    <p>Online Tutoring, Gaming</p>
                  </div>
                </li>
                <li onClick={()=>displayJobModal()}>
                  <Md.MdHomeRepairService id="ic" />
                  <div>
                    Miscellaneous
                    <p>All Other Categories</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="hero">
        <h1>Limitless Experience</h1>
        <p id="roam">Roam Around With Your Business</p>
        <p id="roamtxt">
          Dotem eiusmod tempor incune utnaem labore etdolore maigna aliqua enim
          poskina ilukita ylokem lokateise ination voluptate velit esse cillum
          dolore eu fugiat nulla pariatur lokaim urianewce. Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Sed eget leo rutrum,
          ullamcorper dolor eu, faucibus massa. Etiam placerat mattis
          pellentesque. Mauris eu mollis arcu. Nullam tincidunt auctor mattis.
          Donec pretium porta est ut ullamcorper
        </p>
      </div>
      {displayModal && (
        <FreelancerListModal removeModal={() => setDisplayModal(false)} />
      )}
    </div>
  );
};

export default DashboardHome;
