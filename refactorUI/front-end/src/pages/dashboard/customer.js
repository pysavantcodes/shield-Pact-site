import React from 'react';
import './customer.css';

const CustomerSection = ()=>{
	return (
    <>
        <TaskCreator/>
        <TaskList/>
    </>
	);
}


const TaskCreator = ()=>{
	return (
	<div className="create">
        <h2>Offer Task</h2>
        <div className="card">
            <div className="to">
                <h3>To</h3>
                <input placeholder="0x2727923932397bd" type="text" name="" id=""/>
            </div>
            <div className="taskdescription">
                <h3>Description</h3>
                <textarea placeholder="Enter the details of your task.." name="" id="" cols="30" rows="10"></textarea>
            </div>
            <div className="to">
                <h3>Task 1</h3>
                <input placeholder="Do this for me?" type="text" name="" id=""/>
            </div>
            <div className="to">
                <h3>Task 2</h3>
                <input placeholder="Do this for me?" type="text" name="" id=""/>
            </div>
            <div className="wallet">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-upload-cloud"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
                <p>Attach Files & Documents</p>
            </div>
            <button className="bt                                                                                                                                    n">Offer Task</button>
        </div>

    </div>
	);
}

const Task = ()=>{
	return(
		<div className="task">
            <div className="left">
                <h3>Name of Task</h3>
                <p>To : 0xnd9nwidcbubefhdb298d</p>
            </div>
            <p className="center">
                10 days left
            </p>
            <div className="progress">
                <progress max="100" value="60"></progress>
                <p id="progress">60%</p>
            </div>
        </div>
	);
}

const TaskList = ()=>{
	return(
		<div className="pending">
            <h2>Ongoing Tasks</h2>
            {Array(4).fill(0).map(x=><Task/>)}
        </div>
	);
}

export default CustomerSection;