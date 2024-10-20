import React,{useCallback, useState, useEffect} from 'react';


let logoutTimer;

const Authenticate =  () =>{
	const [token,setToken] = useState(null);
	const [userId, setUserId] = useState(null);
	const [role, setRole] = useState('unauthorized');
	const [tokenExpiration, setTokenExpiration] = useState(null);


	const login = useCallback((uid, tok,role,expirationTime)=>{
		setToken(tok);
		setUserId(uid);
		setRole(role);

		const tokenExpirationTime = expirationTime ? new Date(expirationTime): new Date(new Date().getTime() + 1000 * 60 * 60* 6);
		setTokenExpiration(tokenExpirationTime);
		localStorage.setItem(
			'userData',JSON.stringify({
				userId:uid,
				token:tok,
				role:role,
				expirationTime : tokenExpirationTime.toISOString()

			}));
		
	},[]);


	const logout = useCallback(()=>{
		setToken(null);
		setUserId(null);
		setTokenExpiration(null);
		setRole(null);
		localStorage.removeItem('userData');
	});
	useEffect(()=>{ //problem in user experience 
		const userData = JSON.parse(localStorage.getItem('userData'));
		if(userData && userData.token && new Date(userData.expirationTime)>new Date()){
			login(userData.userId,userData.token,userData.role,userData.expirationTime);
		}
	},[login]);

	useEffect(()=>{
		if(token && tokenExpiration){
			const remainingTime = tokenExpiration.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout,remainingTime);
		}
		else{
			clearTimeout(logoutTimer);
		}

	},[token,logout, tokenExpiration]);

	return [login,logout, token, userId,role];
} 
export default Authenticate;