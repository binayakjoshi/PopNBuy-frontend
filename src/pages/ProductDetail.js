import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useForm } from '../hooks/form-hook';
import AuthContext from '../context/auth-context';
import { VALIDATOR_QUANTITY } from '../components/customElements/validator';
import Button from '../components/customElements/Button';
import Input from '../components/customElements/Input';
import ErrorModal from '../components/customElements/ErrorModal';
import Modal from '../components/customElements/Modal';
import Card from '../components/customElements/Card';
import HttpRequest from '../hooks/http-hook';
import LoadingSpinner from '../components/customElements/LoadingSpinner';
import './ProductDetail.css';

const ProductDetail = (props) => {
  const { pid } = useParams();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, error, sendRequest, clearError] = HttpRequest();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadedProduct, setLoadedProduct] = useState(null);

  const [formState, inputHandler] = useForm(
    {
      quantity: {
        value: '',
        isValid: false,
      },
      size: {
        value: '',
        isValid: false,
      },
      color: {
        value: '',
        isValid: false,
      }
    },
    false
  );

  const showConfirmModalHandler = () => setShowConfirmModal(true);
  const closeConfirmModalHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/products/${pid}`,
        'DELETE',
        null,
        {
          Role: 'Role ' + auth.role,
          Authorization: 'Bearer ' + auth.token,
        }
      );
      navigate('/');
    } catch (err) {}
  };

  const addToCart = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/products/addToCart/${pid}`,
        'POST',
        JSON.stringify({
          productId: pid,
          quantity: formState.inputs.quantity.value,
          color: formState.inputs.color.value,
          size: formState.inputs.size.value,
        }),
        {
          Role: 'Role ' + auth.role,
          Authorization: 'Bearer ' + auth.token,
          'Content-Type': 'application/json',
        }
      );
      navigate('/');
    } catch (err) {}
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/products/${pid}`;
        const responseData = await sendRequest(url);
        setLoadedProduct(responseData.product);
      } catch (error) {
        console.error(error);
      }
    };
    getProduct();
  }, [sendRequest, pid]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={closeConfirmModalHandler}
        header="Are You Sure?"
        footerClass="product-item__modal-actions"
        footer={
          <div>
            <Button inverse onClick={closeConfirmModalHandler}>
              CANCEL
            </Button>
            <Button onClick={confirmDeleteHandler}>DELETE</Button>
          </div>
        }
      >
        <p>Once a product is Deleted it can't be undone. Are you sure you want to continue?</p>
      </Modal>

      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}

      {loadedProduct && (
        <Card className="product-detail">
            <div className="single-product-image">
              <img src={`${process.env.REACT_APP_BACKEND_URL}/${loadedProduct.image}`} alt={loadedProduct.name} />
            </div>
            <form className="product-detail-info" onSubmit={addToCart}>
              <label htmlFor="name" className="product-detail-name">{loadedProduct.name}</label>
              <label htmlFor="description" >{loadedProduct.description}</label>
              <label htmlFor="price"className="product-detail-price">${loadedProduct.price}</label>
                <Input
                  element="radio"
                  id="color"
                  name="color"
                  label="Select a Color:"
                  options={loadedProduct.colors.map(color => ({ label: color, value: color }))}
                  onInput={inputHandler}
                  errorText="Please select a color"
                  validators={[]}
                />
                <Input
                  element="radio"
                  id="size"
                  name="size"
                  label="Select a Size:"
                  options={loadedProduct.sizes.map(size => ({ label: size, value: size }))}
                  onInput={inputHandler}
                  errorText="Please select a size"
                  validators={[]}
                />
               {!loadedProduct.isAvailable && (
                <label className="product-isAvailable" htmlFor="isAvailable">Out of Stock</label>
              )}
              <Input
                element="input"
                id="quantity"
                type="number"
                onInput={inputHandler}
                validators={[VALIDATOR_QUANTITY()]}
                errorText="Please enter a valid quantity"
              />
              <div className="product-actions">
                { auth.role!=='admin' && (
                  <Button
                  type="submit"
                  disabled={!loadedProduct.isAvailable || !formState.isValid}
                >
                  Add To Cart
                </Button>
                  )
                  
                }
                {auth.role === 'admin' && (
                  <Button to={`/products/editProduct/${pid}`}>EDIT</Button>
                )}
                {auth.role === 'admin' && (
                  <Button type="button"onClick={showConfirmModalHandler}>DELETE</Button>
                )}
              </div>
            </form>

        </Card>
       
        
      )}
    </React.Fragment>
  );
};

export default ProductDetail;
