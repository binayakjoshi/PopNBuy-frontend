import React from 'react';
import {Link} from 'react-router-dom';
import Card from '../customElements/Card';
import './ProductItem.css';

const ProductItem = (props) =>{

	return (	
		<React.Fragment>
			
			<li className="product-item">
				<Link to={`/products/productDetail/${props.id}`} className="product-link">
					<Card className="product-content">
						<div className="product-image">
							<img src={`${process.env.REACT_APP_BACKEND_URL}/${props.image}`} alt={props.name}/>
						</div>
						<div className="product-info"> 
							<h2 className ="product-name">{props.name}</h2>
							<h3>${props.price}</h3>
						</div>
					</Card>
				</Link>
				
			</li>
		</React.Fragment>
	);
}
export default ProductItem;
