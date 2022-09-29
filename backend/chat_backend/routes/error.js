
const registerErrorHandler = (app)=>{
	//404 handler
	app.use(function(req, res, next) {
	    res.status(404);
	    return res.json({error:true, msg:"Not Found"});
	});

	// error handler
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  return res.render({error:true, msg:err.message});
	});
}

module.exports = registerErrorHandler;