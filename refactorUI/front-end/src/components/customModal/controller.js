import React from "react";
import {Success, Failed, Process, Info} from './model';


//STATUS
const PROCESS = "PROCESS";

const SUCCESS = "SUCCESS";

const FAILED  = "FAILED";

const INFO = "INFO";

const Controller  = ({status, update})=>{
	let result;
	
	if(status.action === PROCESS)
		result = <Process {...status.data}/>

	else if(status.action === SUCCESS)
		result = <Success {...status.data}/>

	else if(status.action === FAILED)
		result = <Failed {...status.data}/>

	else if(status.action === INFO)
		result = <Info {...status.data}/>

	return result;
}

const customActionCreate = (action)=>(_update, content, handlers)=>_update({action,data:{content, handlers}});

const statusCreate = {
	process:customActionCreate(PROCESS),
	success:customActionCreate(SUCCESS),
	failed:customActionCreate(FAILED),
	info:customActionCreate(INFO),
	reset:(_update)=>()=>customActionCreate(null)(_update)
}

const statusType = {PROCESS, SUCCESS, FAILED, INFO};

export default Controller

export {statusType, statusCreate, customActionCreate};