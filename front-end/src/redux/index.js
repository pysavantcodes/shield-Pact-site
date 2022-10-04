import {configureStore, createSlice} from '@reduxjs/toolkit';
import helperLib from './utils';


const initialState = {};

const walletSlice = createSlice({
	name:'helper Connect',
	initialState,
	reducers:{
		init:helperLib.init
	}
})

const store = configureStore({
	reducer:{
		connectWallet:walletSlice.reducer,
	}
})

export default store;

export const {connectWallet} = walletSlice.actions;