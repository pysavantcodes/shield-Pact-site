
///functions available in project
/// 


//SHould provide Signers for write and Provider for read
const getContract = (signer, address, ABI)=>{
	return new ethers.Contract(address, ABI, signer);
}

const getSigner = async provider => await provider.getSigner();

//Method

//SETTERS 
/**
should be called by client
**/
const addProject = (contract, id, projecthash, checkpointRewards)=>{
	const result = await contract.addProject(id, projecthash, checkpointRewards);
	return result
}


/**
called by client
**/
const assign = (id, freelancerAddress)=>{

}


/**
called by client
**/
const checkpointCompleted = (id, index)=>{

}


/**
called by freelancer or client
**/
const unassign = (id)=>{

}


/**
called by client
**/
const deleteProject = (id)=>{

}


/**GETTER**/
/*returns all project*/
const getAllProjects = ()=>{}

/*get next 20 projects from index*/
const  get20Projects = (startsFromIndex)=>{

}

/*gets all projects created in existence*/
const getProject = (_id)=>{

}


/*gets all projects assigned to freelancer*/
const getfreelancerProjects = (freelancerAddress)=>{

}


/*gets all projects created by client*/
const getClientProjects = (clientAddress)=>{

}


/**
Event Handlers are here
**/
const addProjectEvent = (id, clientAddress)=>{}
const ProjectAssignedEvent = (id, freelancerAddress)=>{};
const CheckpointCompletedEvent = (id, checkpointIndex)=>{};
const ProjectUnassignedEvent = (id)=>{};
const ProjectDeletedEvent = (id)=>{};



