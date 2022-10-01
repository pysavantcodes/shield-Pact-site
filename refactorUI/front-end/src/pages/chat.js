import React from 'react';
import './chat.css';

const ChatSection  = ()=>{
    return (
    <>
         <main>
            <header>
                <nav>
                    <div className="left">
                        <img src="/resources/output-onlineimagetools.png" alt=""/>
                    </div>
                    <div className="right">
                        <p>Login</p>
                        <button className="btn">Connect Wallet</button>
                    </div>
                </nav>
            </header>
            <div className="nav">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <p>Back</p>
            </div>
            <ChatList/>
        </main>
        <ChatModal/>
    </>
    );
}

const ChatList = ()=>{
    return (
    <section>
        <div className="chats-card">
            <h1>Chats</h1>
            <div className="chats">
                {Array(4).fill(0).map(x=><Chat/>)}
            </div>
        </div>
    </section>
    );
}


const Chat = ()=>{
    return (
         <div className="single-chat">
            <div>
                <h3>Address: 0x28u8sh3rn8db8b9dd89d</h3>
                <p>Hello, have you received the projects?</p>
            </div>
            <p id="time">29/20/30<br/>12:30 PM</p>
        </div>
    );
}

const ChatModal = ()=>{
    return (
    <div className="modal-bg">
        <p id="cancel">+</p>
        <div className="reply-modal">
            <h1>Reply</h1>
            <p id="address-val"></p>
            <textarea rows="10" placeholder="Send a Reply..."></textarea><br/>
            <button className="btn">Send</button>
        </div>
    </div>
    );
}


export default ChatSection;