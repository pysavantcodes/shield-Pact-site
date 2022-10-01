import {createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";
import DefaultLayout from "./components/layout";
import StackingSection from "./pages/staking";
import SwapSection from "./pages/swap";
import LaunchPadSection from "./pages/launchpad";
import ChatSection from './pages/chat';
import DashBoardLayout from "./components/dashboard/layout";
import ClientSection from "./pages/dashboard/client";
import CustomerSection from "./pages/dashboard/customer";

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
			}
		])                                                                                                                                                                                                                                                                                                                                                                                ;

const App = ()=><RouterProvider router={router}/>
	
export default App;
