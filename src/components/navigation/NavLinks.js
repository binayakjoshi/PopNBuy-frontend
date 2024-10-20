import React,{useContext} from 'react';
import {NavLink} from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = (props) =>{
	const auth = useContext(AuthContext);

	return (
		<ul className = "nav-links">
			<li className="nav-link-line">
				<NavLink to="/" >Home</NavLink> 
			</li>
			{ !auth.isLoggedIn && 
				(<li className="nav-link-line">
					<NavLink to="/auth" >Authenticate</NavLink> 			
				</li>)
			}
			{
				auth.isLoggedIn && auth.role==="admin" && (
						<li className="nav-link-line">
							<NavLink to="/products/addProduct">Add Product</NavLink>
						</li>
			)}
			
			{
				auth.isLoggedIn && auth.role==="customer" && (
						<li className="nav-link-line">
							<NavLink to={`/users/viewCart/${auth.userId}`}>View Cart</NavLink>
						</li>
			)}
			{ auth.isLoggedIn && 
				(<li className="nav-link-button">
					<button onClick={auth.logout}>logout</button>		
				</li>)
			}
			
		</ul>
		);
}
export default NavLinks;