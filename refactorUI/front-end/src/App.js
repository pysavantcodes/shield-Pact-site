import React from 'react';
import {createBrowserRouter, RouterProvider, Navigate, Redirect} from "react-router-dom";
import DefaultLayout from "./components/layout";
import StackingSection from "./pages/staking";
import SwapSection from "./pages/swap";
import LaunchPadSection from "./pages/launchpad";
import ChatSection from './pages/chat';
import DashBoardLayout from "./components/dashboard/layout";
import ClientSection from "./pages/dashboard/client";
import CustomerSection from "./pages/dashboard/customer";
import NFTLayout from "./components/nft/layout";
import NFTHome from "./pages/nft/home";
import NFTCreate from "./pages/nft/create";
import NFTExplore from './pages/nft/explore';
import Web3Container from './context/_web3_container';

const router = createBrowserRouter([
			{	
				path:'/',
				element:<DefaultLayout/>,
				children:[
					{
						path:'',//default
						element:<Navigate to='launchpad'/>
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
					}
				]
			},
			{
				path:'/chat',
				element:<ChatSection/>
			},
			{
				path:'/dashboard',
				element:<DashBoardLayout/>,
				children:[
					{	path:'',//default to client
						element:<Navigate to="client"/>
					},
					{
						path:'client',
						element:<ClientSection/>
					}, 
					{
						path:'customer',
						element:<CustomerSection/>
					}
				]
			},
			{
				path:'/nft',
				element:<NFTLayout/>,
				children:[
					{	path:'',//default to client
						element:<Navigate to="/nft/home"/>
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
						element:<Navigate to="/nft/home"/>//<NFTExplore/>
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
