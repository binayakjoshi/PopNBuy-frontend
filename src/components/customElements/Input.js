import React, { useReducer, useEffect } from 'react';

import { validate } from './validator';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      }
    }
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  let element;

  if (props.element === 'input') {
    element = (
      <input
        id={props.id}
        type={props.type}
        readOnly={props.readOnly}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );
  } else if (props.element === 'textarea') {
    element = (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
        readOnly={props.readOnly}
      />
    );
  } else if (props.element === 'radio') {
    element = (
      <div id={props.id} className="radio-group" onBlur={touchHandler}>
        {props.options.map(option => (
          <div className="radio-components">
            <input
              className="radio-input"
              type="radio"
              name={props.name} 
              value={option.value}
              checked={inputState.value === option.value}
              onChange={changeHandler}

            />
            <span className="custom-radio"></span> 
            <label>{option.label}</label>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
