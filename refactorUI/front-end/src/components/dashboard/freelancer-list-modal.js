import React from "react";

const FreelancerListModal = ({ removeModal }) => {
  return (
    <div class="modal-bg" style={{
      
      padding: "1rem",
    }}>
      <p onClick={removeModal} id="cancel">
        +
      </p>
      <div class="reply-modal">
        <div className="freelancer">
          <h4
            style={{
              lineHeight: "normal",
              fontSize: "14px",
               margin: ".2rem 0",
            }}
          >
            List of Freelancers under Writing & Translation
          </h4>
          <div className="eachFreelancer"
            style={{
              padding: ".5rem 0"
            }}>
            <p style={{ lineHeight: "normal", fontSize: "12px", margin:"0"}}>
              0x50859E2937C3C487f4CBF343d7e6c4693e7Bae94
            </p>
            <button
              className="btn-border"
              style={{
                lineHeight: "normal",
                fontSize: "10px",
                 margin: ".2rem 0",
                padding: ".3rem",
                borderRadius: "3px",
              }}
            >
              Copy address
            </button>
          </div>
          <div className="eachFreelancer"
            style={{
              padding: ".5rem 0"
            }}>
            <p style={{ lineHeight: "normal", fontSize: "12px", margin:"0"}}>
              0x50859E2937C3C487f4CBF343d7e6c4693e7Bae94
            </p>
            <button
              className="btn-border"
              style={{
                lineHeight: "normal",
                fontSize: "10px",
                 margin: ".2rem 0",
                padding: ".3rem",
                borderRadius: "3px",
              }}
            >
              Copy address
            </button>
          </div>
        </div>
        <div className="job">
          <h4
            style={{
              lineHeight: "normal",
              fontSize: "14px",
               margin: ".2rem 0",
            }}
          >
            List of Jobs under Writing & Translation
          </h4>
          <div className="eachJob"
            style={{
              padding: ".5rem 0"
            }}>
            <p style={{ lineHeight: "normal", fontSize: "12px", margin:"0"}}>
              <strong>Name of Job</strong> : Web Dev <br />
              <strong>Job ID</strong> : FUU4ZID8 <br />
              <strong>Duration</strong> : 1 month <br />
              <strong>Budget</strong> : 1 BNB  <br/>
              <strong>File reference path</strong> : <a href="https://shieldpact.global/uploads/pages/5/1579153511-img-03.png">View Image</a>
            </p>
            <button
              className="btn-border"
              style={{
                lineHeight: "normal",
                fontSize: "10px",
                 margin: ".4rem 0",
                padding: ".3rem",
                borderRadius: "3px",
              }}
            >
              Send Proposal as Freelancer
            </button>
          </div>
          <div className="eachJob"
            style={{
              padding: ".5rem 0"
            }}>
            <p style={{ lineHeight: "normal", fontSize: "12px", margin:"0"}}>
              <strong>Name of Job</strong> : Web Dev <br />
              <strong>Job ID</strong> : FUU4ZID8 <br />
              <strong>Duration</strong> : 1 month <br />
              <strong>Budget</strong> : 1 BNB  <br/>
              <strong>File reference path</strong> : <a href="https://shieldpact.global/uploads/pages/5/1579153511-img-03.png">View Image</a>
            </p>
            <button
              className="btn-border"
              style={{
                lineHeight: "normal",
                fontSize: "10px",
                 margin: ".4rem 0",
                padding: ".3rem",
                borderRadius: "3px",
              }}
            >
              Send Proposal as Freelancer
            </button>
          </div>
          <div className="eachJob"
            style={{
              padding: ".5rem 0"
            }}>
            <p style={{ lineHeight: "normal", fontSize: "12px", margin:"0"}}>
              <strong>Name of Job</strong> : Web Dev <br />
              <strong>Job ID</strong> : FUU4ZID8 <br />
              <strong>Duration</strong> : 1 month <br />
              <strong>Budget</strong> : 1 BNB  <br/>
              <strong>File reference path</strong> : <a href="https://shieldpact.global/uploads/pages/5/1579153511-img-03.png">View Image</a>
            </p>
            <button
              className="btn-border"
              style={{
                lineHeight: "normal",
                fontSize: "10px",
                 margin: ".4rem 0",
                padding: ".3rem",
                borderRadius: "3px",
              }}
            >
              Send Proposal as Freelancer
            </button>
          </div>
          <div className="eachJob"
            style={{
              padding: ".5rem 0"
            }}>
            <p style={{ lineHeight: "normal", fontSize: "12px", margin:"0"}}>
              <strong>Name of Job</strong> : Web Dev <br />
              <strong>Job ID</strong> : FUU4ZID8 <br />
              <strong>Duration</strong> : 1 month <br />
              <strong>Budget</strong> : 1 BNB  <br/>
              <strong>File reference path</strong> : <a href="https://shieldpact.global/uploads/pages/5/1579153511-img-03.png">View Image</a>
            </p>
            <button
              className="btn-border"
              style={{
                lineHeight: "normal",
                fontSize: "10px",
                 margin: ".4rem 0",
                padding: ".3rem",
                borderRadius: "3px",
              }}
            >
              Send Proposal as Freelancer
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default FreelancerListModal;
