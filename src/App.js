import React ,{useState,useEffect,Suspense}from 'react';
import {
  BrowserRouter as 
    Router,
    Route,
    Navigate,
    Routes
} from 'react-router-dom';
import Authenticate from './hooks/auth-hook';
import MainNavigation from './components/navigation/MainNavigation';
import ViewAllProduct from './pages/ViewAllProduct';
import Auth from './pages/Auth';
//import AddProduct from './pages/AddProduct';
//import EditProduct from './pages/EditProduct';
import AuthContext from './context/auth-context';
import ProductDetail from './pages/ProductDetail';
//import ViewCart from './pages/ViewCart';
import LoadingSpinner from './components/customElements/LoadingSpinner';
import './App.css';

const AddProduct = React.lazy(()=>import('./pages/AddProduct'));
const EditProduct = React.lazy(()=>import('./pages/EditProduct'));
const ViewCart = React.lazy(()=>import('./pages/ViewCart'));


const App = ()=>{
  const [login,logout, token, userId,role] = Authenticate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthChecked,setIsAuthChecked] = useState(false);
  
  useEffect(()=>{
    if(token && role){
      setIsAuthChecked(true);
    }
    else if(role==="unauthorized"){
      setIsAuthChecked(true);
    }
  },[token,role]);

  if(!isAuthChecked){
    return (<LoadingSpinner asOverlay/>);
  }  
  const searchHandler = (query)=>{
    setSearchQuery(query);
  };
  
  let routes;

  if(token && role==='customer'){
    routes = (
    <Routes>
      <Route path="/" element={<ViewAllProduct searchQuery={searchQuery}/>}/>
      <Route path="/products/productDetail/:pid" element={<ProductDetail/>}/>
      <Route path={`/users/viewCart/${userId}`} element={<ViewCart/>}/>
      <Route
        path="*"
        element={<Navigate to="/" replace />}
        />
          
    </Routes>
    );

  }
  else if(token && role==='admin'){
    routes = (
    <Routes>
      <Route path="/" element={<ViewAllProduct searchQuery={searchQuery}/>}/>
      <Route path="/products/productDetail/:pid" element={<ProductDetail/>}/>
      <Route path="/products/addProduct/" element={<AddProduct/>}/>
      <Route path="/products/editProduct/:pid" element={<EditProduct/>}/>
      <Route
        path="*"
        element={<Navigate to="/" replace />}
        />
          
    </Routes>
    );

  }
  else{
    routes = (
    <Routes>
      <Route path="/" element={<ViewAllProduct searchQuery={searchQuery}/>}/>
      <Route path="/auth" element={<Auth/>} /> 
      <Route path="/products/productDetail/:pid" element={<ProductDetail/>}/>
         
      <Route
        path="*"
        element={<Navigate to="/" replace />} /> 
    </Routes>
    );

  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn :!!token,
        token:token,
        userId:userId,
        login : login,
        logout : logout,
        role:role
      }}
    >
      <Router>
        <MainNavigation onSearch={searchHandler} searchQuery={searchQuery}/>
        <main>
          <Suspense
            fallback={
              <div className="center"><LoadingSpinner/></div>
            }
            >{routes}
          </Suspense></main>
      </Router>
    </AuthContext.Provider> 
    )
   



}

export default App;
