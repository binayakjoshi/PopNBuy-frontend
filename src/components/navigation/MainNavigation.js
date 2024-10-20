import React, {useState,useEffect} from 'react';
import {Link,useNavigate, useLocation} from 'react-router-dom';
import MainHeader from './MainHeader';
import SideDrawer from './SideDrawer';
import Backdrop from './Backdrop';
import NavLinks from './NavLinks';
import SearchBox from './SearchBox';
import './MainNavigation.css';

const MainNavigation = (props)=>{

	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();


	const openDrawerHandler = () => {
		setDrawerIsOpen(true);
	}
	const closeDrawerHandler = () => {
		setDrawerIsOpen(false);
	}
	useEffect(() => {
    if (props.searchQuery && location.pathname !== '/') {
      navigate('/');
    }
  }, [props.searchQuery, location, navigate]);

	return (
		<React.Fragment>
			{drawerIsOpen && <Backdrop onClick={closeDrawerHandler}/>}
			<SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
				<nav className="Main-navigation__drawer-nav">
					<NavLinks/>
				</nav>
			</SideDrawer>
			<MainHeader>
				<button
					className="Main-navigation__menu-btn"
					onClick = {openDrawerHandler}
				>
					<span/>
					<span/>
					<span/>
				</button>
				<h1 className= "Main-navigation__title">
					<Link to="/">Pop N'Buy</Link>
				</h1>
				<SearchBox className="Main-navigation__searchbox" onSearch={props.onSearch} value={props.searchQuery}/>
				<nav className="Main-navigation__header-nav">
					<NavLinks/>
				</nav>
			</MainHeader>



		</React.Fragment>
	);

}
export default MainNavigation;