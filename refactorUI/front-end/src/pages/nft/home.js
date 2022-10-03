import React from 'react';

const Container = ()=>{
	return (
    <Banner/>
    // <CarouselContainer/>

    // <ServiceSection/>
    // <ProductSection/>

    // <ShareModal/>
   	
   	// <ReportModal/>
    
	);
}

const Banner = ()=>{
	return (
	<div className="slider-one rn-section-gapTop">
        <div className="container">
            <div className="row row-reverce-sm align-items-center">
                <div className="col-lg-5 col-md-6 col-sm-12 mt_sm--50">
                    <h2 className="title" dataSalDelay="200" dataSal="slide-up" dataSalDuration="800">Discover Digital Art, Collect and Sell Your Specific NFTs.</h2>
                    <p className="slideDisc" dataSalDelay="300" dataSal="slide-up" dataSalDuration="800">Partner with one of the world’s largest retailers to showcase your brand and products.
                    </p>
                    <div className="button-group">
                        <a className="btn btn-large btn-primary" href="#" dataSalDelay="400" dataSal="slide-up" dataSalDuration="800">Get Started</a>
                        <a className="btn btn-large btn-primary-alta" href="create.html" dataSalDelay="500" dataSal="slide-up" dataSalDuration="800">Create</a>
                    </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-12 offset-lg-1">
                    <div className="slider-thumbnail">
                        <img src="/assets/images/slider/Restorer-amico.png" alt="Slider Images"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
	);
}



export default Container;