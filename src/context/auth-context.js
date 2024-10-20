import React,{createContext} from 'react';

const AuthContext = createContext({
	isLoggedIn : false,
	login:()=>{},
	logut: ()=>{},
	userId: null,
	token:null,
	role:null
});
export default AuthContext;