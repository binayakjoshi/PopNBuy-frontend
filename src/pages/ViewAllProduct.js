import React,{useEffect,useState} from 'react';

import ProductList from '../components/product/ProductList';
//import AuthContext from '../context/auth-context';
import HttpRequest from '../hooks/http-hook';
import ErrorModal from '../components/customElements/ErrorModal';
import Scroll from '../components/customElements/Scroll';
import LoadingSpinner from '../components/customElements/LoadingSpinner';


const ViewAllProduct = (props)=>{
	const [isLoading,error,sendRequest,clearError] = HttpRequest();
	const [loadedProducts,setLoadedProducts] = useState([]);
	const [filteredProducts,setFilteredProducts] = useState([]);

	useEffect(()=>{
		const getProducts = async () => {
			try{
				const ResponseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/products`);
				setLoadedProducts(ResponseData.products);
			
			}
			catch(error){
				console.log(error)
			}
		}
		getProducts();
		
	},[sendRequest]);

	useEffect(()=>{
		if(loadedProducts.length>0){
			if(props.searchQuery.toLowerCase()===''){
			setFilteredProducts(loadedProducts);
			}
			else{
				const products  = loadedProducts.filter(product=>product.name.toLowerCase().includes(props.searchQuery.toLowerCase()));
				setFilteredProducts(products);
			}
		}
		
	},[loadedProducts,props.searchQuery]);

	
	return(
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
      		{isLoading && (
	          <LoadingSpinner asOverlay/>
	       )}
		{!isLoading && filteredProducts.length>0 && <Scroll><ProductList products={filteredProducts} isLoading={isLoading}/></Scroll>}		
		</React.Fragment>
		);
};
export default ViewAllProduct;