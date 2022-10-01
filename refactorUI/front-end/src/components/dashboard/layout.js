import React from "react";
import {Outlet} from "react-router-dom";

const Layout = ()=>{
	return (
    <>
		<nav onClick={()=>{}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
        <p>Back</p>
    </nav>
    <section className="dashboard">
        <h1>{"Customer"} Dashboard</h1>
        <div className="wallet">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-minus"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            <p>Wallet Address: 0Xnd9289enoqa3hdb298d</p>
        </div>
        <button onClick={()=>{}} className="btn-border">
            Enter Chat Room
        </button>
        <section className="tasks">
            the child here
        	<Outlet/>
        </section>
    </section>
	</>
    );
}

export default Layout;