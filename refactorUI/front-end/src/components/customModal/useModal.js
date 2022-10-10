import React, {useReducer} from "react";

//MVC
const useInfoModal = ({Controller})=>{
	const [status, update] = useReducer((state, action)=>({...state,...action}), {})

	const View = ()=><Controller {...{status, update}}/>;

	return {View, update, status};
}

export default useInfoModal;