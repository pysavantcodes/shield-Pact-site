import React from "react";
import "./client.css"
import * as Md from "react-icons/md"
import data from "./fake-jobs";
import "./customer.css"
import Chat from "../../components/chat-modal";
import FreelancerListModal from "../../components/dashboard/freelancer-list-modal";
import {
    useConnectModal,
    useDisconnect,
    useAccount,
    useNetwork,
  } from "@web3modal/react";
import { NavLink } from "react-router-dom";
import { useState } from "react";


const Container = () => {
  const { address, isConnected } = useAccount();
  const [displayModal, setDisplayModal] = useState(false)
  const [displayChat, setDisplayChat] = useState(false);

  for(let i=0; i<document.querySelectorAll(".categories ul li").length; i++ ){
    document.querySelectorAll(".categories ul li")[i].addEventListener("click",()=>{
      setDisplayModal(true);

    })
    
  }

  return (
    <section class="dashboard">
      <h1>Client Dashboard</h1>
      <div class="wallet">
        <div>
        <Md.MdFilePresent fontSize={23}/>
          
          <p>Wallet Address: {address}</p>
        </div>
      </div>
        <section class="tasks">
            <div class="create">
                <h2>Offer Task</h2>
                <div class="card">
                    <div class="to">
                        <h3>To</h3>
                        <input placeholder="0x2727923932397bd" type="text" name="" id=""/>
                    </div>
                    <div class="to">
                        <h3>Name of Job</h3>
                        <input placeholder="Enter Job Name" type="text" name="" id=""/>
                    </div>
                    <div class="taskdescription">
                        <h3>Description</h3>
                        <textarea placeholder="Enter the details of your task.." name="" id="" cols="30" rows="10"></textarea>
                    </div>
        
                    <h3>
                        Attach File as reference <span>(Optional)</span>
                    </h3>
                    <div class="upload">
                        <Md.MdFileUpload id="ic"/>
                        <input type="file" name="" id="" />
                       
                    </div>
                    <button class="btn">Offer Task</button>
                </div>

            </div>
            <div class="service">
          <h2>Pick a Freelancer from these Categories</h2>
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
                  <li>
                  <Md.MdMovie id="ic"/>
                    <div>
                      Influencer Content
                      <p>
                        Videos, Pictures, <NavLink to="/nft">NFTs</NavLink>
                        , Music
                      </p>
                    </div>
                  </li>
                  <li>
                  <Md.MdDraw id="ic"/>
                    <div>
                      Graphic & Design
                      <p>Logo & Brand Entity, Art & Illustration</p>
                    </div>
                  </li>
                  <li>
                  <Md.MdShoppingCart id="ic"/>
                    <div>
                      Digital Marketing
                      <p>Social Media Marketing, Social Media Advertising</p>
                    </div>
                  </li>
                  <li>
                  <Md.MdDocumentScanner id="ic"/>
                    <div>
                      Writing & Translation
                      <p>Articles & Blog Posts, Translation, Resume Writing</p>
                    </div>
                  </li>
                  <li>
                  <Md.MdVideocam id="ic"/>
                    <div>
                      Video & Animation
                      <p>Video Editing, Video Ads and Commercial</p>
                    </div>
                  </li>
                  <li>
                  <Md.MdAudiotrack id="ic"/>
                    <div>
                      Music & Audio
                      <p>Voice Over, Producers & Composers</p>
                    </div>
                  </li>
                  <li>
                  <Md.MdCode id="ic"/>
                    <div>
                      Programming & Tech
                      <p>Wordpress, Website Builders & CMS</p>
                    </div>
                  </li>
                  <li>
                  <Md.MdFileCopy id="ic"/>
                    <div>
                      Data
                      <p>Database, Data Processing</p>
                    </div>
                  </li>
                  <li>
                  <Md.MdAddBusiness id="ic"/>
                    <div>
                      Business
                      <p>Virtual Assistant, E-commerce Management</p>
                    </div>
                  </li>
                  <li>
                  <Md.MdBook id="ic"/>
                    <div>
                      Lifestyle
                      <p>Online Tutoring, Gaming</p>
                    </div>
                  </li>
                  <li>
                  <Md.MdHomeRepairService id="ic"/>
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

        </section>
        <h2>Assigned Jobs</h2>
      <div className="jobs-data">
       
          <table id="customers">
            <tr>
              <th>Job Name</th>
              <th>From (Address)</th>

              <th>Date Assigned</th>
              <th>Unassign Job</th>
              <th>Chat with Freelancer</th>
            </tr>
            {data.map((job) => (
              <tr key={job.id}>
                <td>{job.jobName}</td>
                <td>{job.address}</td>
              
                <td>{job.date}</td>
                <td>
                  <button
                    className="btn"
                    style={{ margin: 0, boxShadow: "none", fontSize: "11px", padding:"10px 20px" }}
                  >
                    Unassign
                  </button>
                </td>
                <td>
                  <button onClick={()=>{setDisplayChat(true)}}
                    className="btn"
                    style={{ margin: 0, boxShadow: "none", fontSize: "11px", padding:"10px 20px" }}
                  >
                    Chat
                  </button>
                </td>
              </tr>
            ))}
          </table>
       
      </div>
      {displayModal && <FreelancerListModal removeModal={()=>setDisplayModal(false)}/>}
      {displayChat && <Chat removeChat={()=>setDisplayChat(false)}/>}
    </section>
  );
};

export default Container;
