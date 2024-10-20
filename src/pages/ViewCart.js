import React,{useContext, useState, useEffect} from 'react';

import {useParams} from 'react-router-dom';
import AuthContext from '../context/auth-context';
import HttpRequest from '../hooks/http-hook';

import CartList from '../components/cart/CartList';
import Scroll from '../components/customElements/Scroll';
import ErrorModal from '../components/customElements/ErrorModal';
import LoadingSpinner from '../components/customElements/LoadingSpinner';

const ViewCart = ()=>{

	const auth = useContext(AuthContext);
	const [loadedProducts,setLoadedProducts] = useState();
	const [isLoading, error, sendRequest, clearError] = HttpRequest();
	const {uid} = useParams();

	const deleteHandler = (productId) => {
		setLoadedProducts(prevProducts=>prevProducts.filter(p=>p.product.id!==productId));
	
	}

	useEffect(() => {
    const getProduct = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}/ViewCart`;
        const responseData = await sendRequest(
        	url,
        	'GET',
        	null,
        	{
	            'Role':'Role '+ auth.role,
	            'Authorization': 'Bearer ' + auth.token,
	            'Content-Type': 'application/json'
        	}
          );
        setLoadedProducts(responseData.cart);
      } catch (error) {
        console.error(error);
      }
    };
    getProduct();
  }, [sendRequest, uid,auth.userId,auth.token,auth.role]);
  
	
	return(
		<React.Fragment>
		<ErrorModal error={error} onClear={clearError}/>
		{isLoading && (
	          <LoadingSpinner asOverlay/>
	       )}
			{!isLoading && loadedProducts && <Scroll><CartList items={loadedProducts} onDelete={deleteHandler} isLoading={isLoading}/></Scroll>}
		</React.Fragment>
	);

}
export default ViewCart;