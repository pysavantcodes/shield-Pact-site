const paginate = async (_obj, _docLent, _cbDoc)=>{
	let {pstart, plimit} = _obj;
	pstart = parseInt(pstart)||0;
	plimit = parseInt(plimit)||_docLent;
	pstart = (pstart*plimit)>=_docLent?0:pstart;
	let data = await _cbDoc(pstart*plimit, plimit??docLent);
	let query  = {prev:pstart, limit:plimit};
	query['next'] = (_docLent - (pstart+1)*plimit) > 0?pstart + 1:null;
	return {data, query};
}


module.exports = {paginate}