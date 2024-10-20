import React from 'react';

import Button from '../customElements/Button';
import Card from '../customElements/Card';
import CartItem from './CartItem';
import './CartList.css';

const CartList = (props)=>{

	if(!props.isLoading && props.items.length===0){
		console.log('loading state::',props.isLoading)
		return (
			<div>
				<Card>
					<h2>Cart is Empty. Maybe add some product?</h2>
          			<Button to="/">Add Product</Button>
				</Card>
			</div>
			);
	}
	else{
		return(
			<ul className="cart-list">
				{
				props.items.map(item=>(
					<CartItem
						key = {item.product.id}
						id={item.product.id}
						name ={item.product.name}
						price ={item.product.price}
						image ={item.product.image}
						color ={item.color}
						size ={item.size}
						quantity={item.quantity}
						onDelete={props.onDelete}
					/>
					))
				}
			</ul>	
		);
	}
}
export default CartList;