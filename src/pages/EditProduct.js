import React,{useEffect,useState,useContext}from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import AuthContext from '../context/auth-context';

import HttpRequest from '../hooks/http-hook';
import {useForm} from '../hooks/form-hook';
import ErrorModal from '../components/customElements/ErrorModal';
import LoadingSpinner from '../components/customElements/LoadingSpinner';
import Card from '../components/customElements/Card';
import Button from '../components/customElements/Button';
import Input from '../components/customElements/Input';
import {VALIDATOR_REQUIRE} from '../components/customElements/validator';


const EditProduct = ()=>{
	const auth = useContext(AuthContext);
	const [isLoading,error,sendRequest,clearError] = HttpRequest();
	const [loadedProduct,setLoadedProduct] = useState(null);
	const { pid} = useParams();
	const navigate = useNavigate();
	console.log(auth.role);

	const [formState,inputHandler,setFormData] = useForm(
		{
			name: {
	        	value: '',
	        	isValid: false,
      		},
      		description: {
	        	value: '',
	        	isValid: false,
      		},
      		price: {
	        	value: '',
	        	isValid: false,
      		},
			isAvailable: {
	        	value: '',
	        	isValid: false,
      		},
	    	sizes: {
	    		value: '',
	        	isValid: false,
	      },
	    	colors: {
	        	value: '',
	        	isValid: false,
	      }

		},false);
	const handleSubmit = async()=>{
		try{
			const url = `${process.env.REACT_APP_BACKEND_URL}/products/${pid}`;
			await sendRequest(
				url,
				'PATCH',
				JSON.stringify(
					{
						name: formState.inputs.name.value,
						description: formState.inputs.description.value,
						price: formState.inputs.price.value,
						colors: formState.inputs.colors.value,
						sizes: formState.inputs.sizes.value,
						isAvailable: formState.inputs.isAvailable.value,
					}),
				{
					'Authorization': 'Bearer ' + auth.token,
					'Content-Type': 'application/json',
					'Role': 'role '+ auth.role
				}
			);
			navigate('/');



		}catch(error){

		}
	}
	useEffect(() => {
	    const getProduct = async () => {
	      try {
	      	const url = `http://localhost:5000/products/${pid}`;
	        const responseData = await sendRequest(url);
	        setLoadedProduct(responseData.product);
	        
	      } catch (error) {
	        console.error(error);
	      }
	    };
	    getProduct();
	    
	}, [sendRequest, pid]);
	useEffect(()=>{
		console.log('loadedProduct::',loadedProduct);
		if(loadedProduct){
			setFormData({
	    		name: {
		        	value: loadedProduct.name,
		        	isValid: true,
	      		},
	      		description: {
		        	value: loadedProduct.description,
		        	isValid: true,
	      		},
	      		price: {
		        	value: loadedProduct.price,
		        	isValid: true,
	      		},
				isAvailable: {
		        	value: loadedProduct.isAvailable,
		        	isValid: true,
	      		},
		    	sizes: {
		    		value: loadedProduct.sizes,
		        	isValid: true,
		      },
		    	colors: {
		        	value: loadedProduct.colors,
		        	isValid: true,
		      }

	    },true);
		}
	    	
	},[loadedProduct,setFormData])

	return(
		<React.Fragment>
		<ErrorModal error={error} onClear={clearError}/>
		{isLoading && <LoadingSpinner asOverlay/>}
			<Card>
				{!isLoading && loadedProduct && (
					<form onSubmit={handleSubmit}>
					<Input 
							element="input" 
							id="name" 
							type="text"
							label ="Name"
							onInput = {inputHandler}
							initialValue={loadedProduct.name}
							validators={[VALIDATOR_REQUIRE()]} 
							initialValid={true}
							errorText="please enter a name."
					/>
					<Input 
							element="input" 
							id="description" 
							type="text"
							label ="Description"
							onInput = {inputHandler}
							initialValue={loadedProduct.description}
							validators={[VALIDATOR_REQUIRE()]} 
							 initialValid={true}
							errorText="please enter a description."
					/>
					<Input 
							element="input" 
							id="price" 
							type="number"
							label ="Price"
							onInput = {inputHandler}
							initialValue={loadedProduct.price}
							validators={[VALIDATOR_REQUIRE()]}
							initialValid={true} 
							errorText="please enter a valid price."
					/>
					<Input 
							element="input" 
							id="sizes" 
							type="text"
							label ="Sizes"
							placeholder= "please enter sizes seperated by commas"
							onInput = {inputHandler}
							initialValue={loadedProduct.sizes}
							validators={[VALIDATOR_REQUIRE()]} 
							initialValid={true}
							errorText="please enter valid sizes."
					/>
					<Input 
							element="input" 
							id="colors" 
							type="text"
							label ="Colors"
							placeholder= "please enter colors seperated by commas"
							onInput = {inputHandler}
							initialValue={loadedProduct.colors}
							validators={[VALIDATOR_REQUIRE()]} 
							initialValid={true}
							errorText="please enter valid colors."
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
					<Button type="submit" disabled={!formState.isValid} >EDIT PRODUCT</Button>	
				</form>
					)}
				
			</Card>
		</React.Fragment>
	);
}
export default EditProduct;