import React from 'react'

const FreelancerListModal = ({removeModal}) => {
  return (
    <div  class="modal-bg">
      <p onClick={removeModal} id="cancel">+</p>
      <div class="reply-modal">
        <h4 style={{lineHeight:"normal", fontSize:"14px", margin:".5rem 0"}}>List of Freelancers under Writing & Translation</h4>
        <div style={{padding:".5rem 0", borderBottom:"1px solid rgba(255,255,255,0.5)"}}>
          <p style={{lineHeight:"normal", fontSize:"10px"}}>
           
            0x50859E2937C3C487f4CBF343d7e6c4693e7Bae94
          </p>
          <button className='btn-border' style={{lineHeight:"normal", fontSize:"12px", margin:".5rem 0", padding:".3rem", borderRadius:"3px"}}>Copy address</button>
        </div>
        <div style={{padding:".5rem 0", borderBottom:"1px solid rgba(255,255,255,0.5)"}}>
          <p style={{lineHeight:"normal", fontSize:"10px"}}>
           
            0x50859E2937C3C487f4CBF343d7e6c4693e7Bae94
          </p>
          <button className='btn-border' style={{lineHeight:"normal", fontSize:"12px", margin:".5rem 0", padding:".3rem", borderRadius:"3px"}}>Copy address</button>
        </div>
        <div style={{padding:".5rem 0", borderBottom:"1px solid rgba(255,255,255,0.5)"}}>
          <p style={{lineHeight:"normal", fontSize:"10px"}}>
           
            0x50859E2937C3C487f4CBF343d7e6c4693e7Bae94
          </p>
          <button className='btn-border' style={{lineHeight:"normal", fontSize:"12px", margin:".5rem 0", padding:".3rem", borderRadius:"3px"}}>Copy address</button>
        </div>
      </div>
    </div>
  )
}

export default FreelancerListModal