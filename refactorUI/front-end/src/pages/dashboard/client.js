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
                        <input type="checkbox" />
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
