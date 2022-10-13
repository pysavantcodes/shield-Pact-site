import React from "react";

const Chat = ({removeChat}) => {
  return (
    <div  class="modal-bg">
      <p onClick={removeChat} id="cancel">+</p>
      <div class="reply-modal">
        <h4>Messages Sent by Client</h4>
        <div className="wallet">
            <p style={{lineHeight:"normal"}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum provident aspernatur sed minima quas maxime eos incidunt earum, veritatis mollitia consequuntur? Enim debitis numquam delectus magni optio beatae accusantium in.</p>
        </div>
        <h4>Reply</h4>
        <p id="address-val"></p>
        <textarea rows="10" placeholder="Send a Reply..."></textarea>
        <br />
        <p style={{lineHeight:"normal", fontSize:"12px"}}>Send all messages at once, as viewer will only see one message</p>
        <button class="btn">Send</button>
      </div>
    </div>
  );
};

export default Chat;
