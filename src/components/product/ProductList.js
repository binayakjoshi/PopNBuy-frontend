import React from 'react';

import Button from '../customElements/Button';
import Card from '../customElements/Card';
import ProductItem from './ProductItem';
import './ProductList.css';

const ProductList = (props)=>{
	if(!props.isLoading && props.products.length===0){
		return (
			<div>
				<Card>
					<h2>No products found. Maybe create one?</h2>
          			<Button to="/products/new">Add Product</Button>
				</Card>
			</div>
			);
	}
	return(
		<ul className="product-list">
			{
				props.products.map(product=>(
					<ProductItem
						key={product.id}
						id ={product.id}
						image={product.image}
						name={product.name}
						price ={product.price}
						/>
				))
			}
		</ul>
		);
}
export default ProductList;