import React from "react";
import "./client.css";
import * as Md from "react-icons/md";
import data from "./fake-jobs";
import category from "./fake-categories";
import Chat from "../../components/chat-modal";
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
  const [displayChat, setDisplayChat] = useState(false)
  
  return (
    <section class="dashboard">
      <h1>Freelancer Dashboard</h1>
      <div class="wallet">
        <div>
          <Md.MdFilePresent fontSize={23} />

          <p>Wallet Address: {address}</p>
        </div>
      </div>
      <h2 style={{ marginTop: "3rem" }}>Specialized Category</h2>
      <div className="specialization">
        {category.map((item)=>(
          <p key={item.id} className="specs">{item.name}</p>
        ))
        }
        
        <button className="btn-border">+ Add Category</button>
      </div>
      <h2>Assigned Jobs</h2>
      <div className="jobs-data">
       
          <table id="customers">
            <tr>
              <th>Job Name</th>
              <th>From (Address)</th>

              <th>Date Assigned</th>
              <th>Accept Job</th>
              <th>Chat with Client</th>
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
                    Accept
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
      <p style={{lineHeight:"normal", fontSize:"10px"}}>* Accepted Jobs will be added to the Accepted Jobs Section</p>
      <h2>Accepted Jobs</h2>

      <div className="jobs-data">
       
          <table id="customers">
            <tr>
              <th>Job Name</th>
              <th>From (Address)</th>
              <th>Stage</th>
              <th>Date Assigned</th>
              <th>Unassign Job</th>
              <th>Chat with Client</th>
            </tr>
            {data.map((job) => (
              <tr key={job.id}>
                <td>{job.jobName}</td>
                <td>{job.address}</td>
                <td>{job.percentage}</td>
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
      {displayChat && <Chat removeChat={()=>setDisplayChat(false)}/>}
    </section>
  );
};

export default Container;
