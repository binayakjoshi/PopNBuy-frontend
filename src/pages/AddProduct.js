import React,{useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import AuthContext from '../context/auth-context';

import HttpRequest from '../hooks/http-hook';
import {useForm} from '../hooks/form-hook';
import ErrorModal from '../components/customElements/ErrorModal';
import ImageUpload from '../components/customElements/ImageUpload';
import LoadingSpinner from '../components/customElements/LoadingSpinner';
import Card from '../components/customElements/Card';
import Button from '../components/customElements/Button';
import Input from '../components/customElements/Input';
import {VALIDATOR_REQUIRE} from '../components/customElements/validator';


const AddProduct = ()=>{
	const auth = useContext(AuthContext);
	const navigate = useNavigate();
	const [isLoading,error,sendRequest,clearError] = HttpRequest();
	const [formState,inputHandler] = useForm(
	{
		name:{
			value:'',
			isValid:false
		},
		description:{
			value:'',
			isValid:false
		},
		price:{
			value:'',
			isValid:false
		},
		image:{
			value:null,
			isValid:false
		},
		colors:{
			value:'',
			isValid:false
		},
		sizes:{
			value:'',
			isValid:false
		},
		isAvailable:{
			value:'',
			isValid:false
		}
	},
	false
	);
	const handleSubmit = async(event)=>{
		event.preventDefault();
		
		try{
			const requestData = new FormData();
			requestData.append('name',formState.inputs.name.value);
			requestData.append('description',formState.inputs.description.value);
			requestData.append('price',formState.inputs.price.value);
			requestData.append('sizes',formState.inputs.sizes.value);
			requestData.append('colors',formState.inputs.colors.value);
			requestData.append('isAvailable',formState.inputs.isAvailable.value);
			requestData.append('image',formState.inputs.image.value);
			
			await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/products/addProduct/`,
				'POST',
				requestData,
				{	
					'Authorization': 'Bearer ' + auth.token,
					'Role': 'Role '+auth.role
				}
			);
			navigate('/');

		}catch(err){
			console.log(err);
		}
	}
	
	return (
		<div>
			{<ErrorModal error={error} onClear={clearError}/>}
			{isLoading && <LoadingSpinner asOverlay/>}
			<Card>
				<form onSubmit={handleSubmit}>
					<Input 
							element="input" 
							id="name" 
							type="text"
							label ="Name"
							onInput = {inputHandler}
							validators={[VALIDATOR_REQUIRE()]} 
							errorText="please enter a name."
					/>
					<Input 
							element="input" 
							id="description" 
							type="text"
							label ="Description"
							onInput = {inputHandler}
							validators={[VALIDATOR_REQUIRE()]} 
							errorText="please enter a description."
					/>
					<Input 
							element="input" 
							id="price" 
							type="number"
							label ="Price"
							onInput = {inputHandler}
							validators={[VALIDATOR_REQUIRE()]} 
							errorText="please enter a valid price."
					/>
					<Input 
							element="input" 
							id="sizes" 
							type="text"
							label ="Sizes"
							placeholder= "please enter sizes seperated by commas"
							onInput = {inputHandler}
							validators={[VALIDATOR_REQUIRE()]} 
							errorText="please enter valid sizes."
					/>
					<Input 
							element="input" 
							id="colors" 
							type="text"
							label ="Colors"
							placeholder= "please enter colors seperated by commas"
							onInput = {inputHandler}
							validators={[VALIDATOR_REQUIRE()]} 
							errorText="please enter valid colors."
					/>
					

					<ImageUpload
            			onInput={inputHandler} 
            			center 
            			id="image" 
            			errorText="Please provide an image." 
            			/>
            		<Input
	                  element="radio"
	                  id="isAvailable"
	                  name="isAvailable"
	                  label="The Product is Available:"
	                  options={[
	                  		{label:'Yes',value:'true'},
	                  		{label:'No',value:'false'}
	                  	]}
	                  onInput={inputHandler}
	                  errorText="Please select one option"
	                  validators={[]}
                	/>
					<Button type="submit" disabled={!formState.isValid} >ADD PRODUCT</Button>
				</form>
			</Card>	
		</div>
		);
}
export default AddProduct;