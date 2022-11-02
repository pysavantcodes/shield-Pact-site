import React from "react";
import {Success, Failed, Process, Info, modalWrapName} from './model';

//STATUS
const PROCESS = "Process";

const SUCCESS = "Success";

const FAILED  = "Failed";

const INFO = "Info";

const createController = (_obj)=>({status, update})=>{
	
	let Modal =  _obj[status.action];
	if(Modal)
		return <Modal {...status.data} update={update}/>
	return null;
}

const defaultSection = {Process, Success, Failed, Info};

const defaultController = createController(defaultSection);

const customActionCreate = (action, hasClickOutSideModalFunc=true)=>(_update, content, handlers, ...extra)=>_update({action,data:{content, handlers, 
							extra, ClickOutSideModalFunc:(e)=>e.target.classList.contains(modalWrapName) && hasClickOutSideModalFunc&&_update({action:null,data:{}})
																																}
																													}
																												);

const statusCreate = {
	process:customActionCreate(PROCESS,false),
	success:customActionCreate(SUCCESS),
	failed:customActionCreate(FAILED),
	info:customActionCreate(INFO),
	reset:(_update)=>()=>customActionCreate(null)(_update)
}

const statusType = {PROCESS, SUCCESS, FAILED, INFO};

export default defaultController;

export {statusType, statusCreate, defaultSection, customActionCreate, createController};