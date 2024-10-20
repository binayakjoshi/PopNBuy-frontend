import React, { useState,useContext } from 'react';

import Button from '../customElements/Button';
import ErrorModal from '../customElements/ErrorModal';
import Modal from '../customElements/Modal';
import Card from '../customElements/Card';
import LoadingSpinner from '../customElements/LoadingSpinner';
import HttpRequest from '../../hooks/http-hook';
import AuthContext from '../../context/auth-context';
import './CartItem.css';

const CartItem = (props) => {

  const auth = useContext(AuthContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOrderPlacedModal, setOrderPlacedModal] = useState(false);
  const [isLoading, error, sendRequest, clearError] = HttpRequest();
  
  const showConfirmModalHandler = () => setShowConfirmModal(true);
  const closeConfirmModalHandler = () => setShowConfirmModal(false);

  const showOrderPlacedModalHandler = () => setOrderPlacedModal(true);
  const closeOrderPlacedModalHandler = () => setOrderPlacedModal(false);

  const userId = auth.userId;


  const confirmRemoveHandler = async() => {
    try{
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`;
      await sendRequest(
        url,
        'DELETE',
        JSON.stringify({
          productId: props.id
        }),
        {
          'Role':'Role '+ auth.role,
          'Authorization': 'Bearer ' + auth.token,
        }
      );
      closeConfirmModalHandler();
      console.log('pid',props.id);
      props.onDelete(props.id); 
    }catch(err){

    }
  };
  const placeOrderHandler = () =>{
    setOrderPlacedModal(true);
    //need to update the app
    //should email the admin user about the pending orders
    //admin user should have pending order page in which s/he can place delivery or reject the order
  };

  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={clearError}/>

      <Modal
        show={showConfirmModal}
        onCancel={closeConfirmModalHandler}
        header="Are you sure?"
        headerClass="cart-item__modal-header"
        contentClass="cart-item__modal-content"
        footerClass="cart-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={closeConfirmModalHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmRemoveHandler}>
              REMOVE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and remove this Item from your Cart?
        </p>
      </Modal>
      <Modal
        show={showOrderPlacedModal}
        onCancel={closeOrderPlacedModalHandler}
        header="ORDER PLACED!!!"
        headerClass="cart-item__modal-header"
        contentClass="cart-item__modal-content"
        footerClass="cart-item__modal-actions"
        footer={
          <React.Fragment>
            <Button onClick={closeOrderPlacedModalHandler}>
              OKAY
            </Button>
            
          </React.Fragment>
        }
      >
        <p>
          Your Order has been placed. You will be inoformed about your order later on.
        </p>
        <p>
         Thankyou.
        </p>
      </Modal>
      {isLoading && <LoadingSpinner asOverlay/>}
      <li>
        <Card className="cart-content">
          <div className="cart-image">
            <img src={`${process.env.REACT_APP_BACKEND_URL}/${props.image}`} alt={props.name} />
          </div>
          <div className="cart-info">
            <h2>{props.name}</h2>
            <h3>${props.price}</h3>
            <h4>Quantity: {props.quantity}</h4>
            <h4>Color: {props.color}</h4>
            <h4>Size: {props.size}</h4>
            <h5>Total: ${props.quantity * props.price}</h5>
            <div className="cart-actions">
              <Button onClick={showConfirmModalHandler}>REMOVE</Button>
              <Button onClick={placeOrderHandler}>PLACE ORDER</Button>
            </div>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default CartItem;
