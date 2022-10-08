import React, {useState} from "react";


//MVC
const Display = ({status})=>{
	return (
		<h1>Status</h1>
	);
}

const useInfoModal = ()=>{
	const [status, update] = useState("Idle");

	const Model = ()=><Display {...{status}}/>;

	return {Model, update}; 
}

export default useInfoModal;