import React from 'react';
import {createBrowserRouter, RouterProvider, Navigate, Redirect} from "react-router-dom";
import Web3Container from './upgrade/web3Wrapper';
import DefaultLayout from "./components/layout";
import StackingSection from "./pages/staking";
import SwapSection from "./pages/swap";
import LaunchPadSection from "./pages/launchpad";
import ChatSection from './pages/chat';
import DashBoardLayout from "./components/dashboard/layout";
import ClientSection from "./pages/dashboard/client";
import CustomerSection from "./pages/dashboard/customer";
// import NFTLayout from "./components/nft/layout";
import NFTHome from "./pages/nft/home";
import NFTCreate from "./pages/nft/create";
import NFTExplore from './pages/nft/explore';
import CreateToken from './pages/create_token';
import CreateLaunchPad from './pages/create_launchpad';
import LaunchDetails from './pages/launchdetails'; 
import AirDropSection from './pages/airdrop';
import AirDropHome from './pages/alldrops'; 

const router = createBrowserRouter([
			{	
				path:'/dApp/',
				element:<DefaultLayout/>,
				children:[
					{
						path:'createtoken',//default
						element:<CreateToken/>,
					},
					{
						path:'createlaunchpad',//default
						element:<CreateLaunchPad/>,
					},
					{
						path:'launchDetails/:addr',//default
						element:<LaunchDetails/>,
					},
					{
						path:'',//default
						element:<Navigate to='launchpad'/>,
					},
					{
						path:'staking',
						element:<StackingSection/>
					},
					{
						path:'launchpad',
						element:<LaunchPadSection/>
					},
					{
						path:'swap',
						element:<SwapSection/>
					},
					{
						path:'createAirdrop',
						element:<AirDropSection/>
					},
					{
						path:'airdrop',
						element:<AirDropHome/>
					}
				]
			},
			
			{
				path:'/dApp/nft',
				element:<DefaultLayout/>,
				children:[
					{	path:'',//default to client
						element:<Navigate to="/dApp/nft/home"/>
					},
					{
						path:'home',
						element:<NFTHome/>
					},
					{
						path:'create',
						element:<NFTCreate/>
					},
					{
						path:'explore',
						element:<Navigate to="/dApp/nft/home"/>//<NFTExplore/>
					}
				]
			}
		])                                                                                                                                                                                                                                                                                                                                                                                ;

const App = ()=>{
	return (
		<Web3Container>
			<RouterProvider router={router}/>
		</Web3Container>
	);
}

	
export default App;
