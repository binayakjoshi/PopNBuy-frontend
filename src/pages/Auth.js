import React,{useContext, useState} from 'react';

import AuthContext from '../context/auth-context';
import HttpRequest from '../hooks/http-hook';
import {useForm} from '../hooks/form-hook';
import ErrorModal from '../components/customElements/ErrorModal';
import LoadingSpinner from '../components/customElements/LoadingSpinner';
import Card from '../components/customElements/Card';
import Button from '../components/customElements/Button';
import Input from '../components/customElements/Input';
import {VALIDATOR_EMAIL,VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../components/customElements/validator';
import './Auth.css';


const Auth = ()=>{
	
	const auth = useContext(AuthContext);
	const [isLoading,error,sendRequest,clearError] = HttpRequest();
	const [isLoginMode, setLoginMode] = useState(true);

	const [formState,inputHandler,setFormData] = useForm(
	{
		email:{
			value: '',
			isValid:false
		},
		password:{
			value: '',
			isValid:false
		}
	}, false
	);
	const switchModeHandler = () =>{
		if(!isLoginMode){
			setFormData({
				...formState.inputs,
				name: undefined
			},
			formState.inputs.email.isValid && formState.inputs.password.isValid
			);

		}
		else{
			setFormData({
				...formState.inputs,
				name :{
					value:'',
					isValid: false
				}
			},false
			);
		}
		setLoginMode(prevMode=>!prevMode);
	}
	const handleSubmit = async(event)=>{
		event.preventDefault();
		if(isLoginMode){
			try{
				const ResponseData =  await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/users/login`,
				'POST',
				JSON.stringify({
					email: formState.inputs.email.value ,
					password: formState.inputs.password.value,
				}),
				{
					'Content-Type': 'application/json',
				}
				);
				auth.login(ResponseData.userId,ResponseData.token,ResponseData.role);
			}catch(err){}	
		}else{
			try{
				const ResponseData =  await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}users/signup`,
				'POST',
				JSON.stringify({
					name: formState.inputs.name.value ,
					email: formState.inputs.email.value ,
					password: formState.inputs.password.value,
				}),
				{
					'Content-Type': 'application/json',
				}
				);
				auth.login(ResponseData.userId,ResponseData.token,ResponseData.role);
			}catch(err){}
		}
	}
	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError}/>
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay/>}
				<h2>Login Required</h2>
				<hr/>
				<form onSubmit = {handleSubmit}>
					{!isLoginMode && (
						<Input 
							element="input" 
							id="name" 
							type="text"
							label ="Name"
							onInput = {inputHandler}
							validators={[VALIDATOR_REQUIRE()]} 
							errorText="please enter a name."
					/>)}
					<Input 
						element="input" 
						id="email" 
						type="email"
						label ="Email"
						onInput = {inputHandler}
						validators={[VALIDATOR_EMAIL()]} 
						errorText="please enter a valid email"
					/>
					<Input 
					element="input" 
					id="password" 
					type="password"
					label ="Password"
					onInput = {inputHandler}
					validators={[VALIDATOR_MINLENGTH(8)]} 
					errorText="password must be at least 8 characters"
					/>
					<Button type="submit" disabled={!formState.isValid} >{isLoginMode ? "LOGIN" : "SIGN UP"}</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>SWITCH TO {!isLoginMode ? "LOGIN" : "SIGN UP"}</Button>
			
			</Card>
		</React.Fragment>
			
		);
}
export default Auth;