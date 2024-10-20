import React from 'react';
import './SearchBox.css';

const SearchBox = (props)=>{

	const handleSearch = event=> props.onSearch(event.target.value);
	
	return(
		<div className="search-box">
			<input
				className="search-input"
				type="text" 
				placeholder="Search Products...."
				value={props.searchQuery} 
				onChange={handleSearch}

			/>
		</div>
	);
}
export default SearchBox;