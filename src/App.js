import React, { useReducer } from 'react';
import DigitButtons from './DigitButtons';
import OperationButtons from './OperationButtons';
export const ACTIONS = { ADD_DIGIT: "add_digit", DELETE_DIGIT: "delete", CLEAR: "clear", OPERATIONS: "operation", RESULT: "result" };
const reducer = ( state, { type, payload } ) =>
{
  switch ( type )
  {
    case ACTIONS.ADD_DIGIT:
      if ( state.overwrite )
      {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        };
      }
      if ( payload.digit === "0" && state.currentOperand === "0" )
      {
        return state;
      }
      if ( payload.digit === "." && state.currentOperand.includes( "." ) )
      {
        return state;
      }
      return {
        ...state,
        currentOperand: `${ state.currentOperand || "" }${ payload.digit }`
      };
    case ACTIONS.OPERATIONS:
      if ( state.currentOperand == null && state.previewsOperand == null )
      {
        return state;
      }
      if ( state.previewsOperand == null )
      {
        return {
          ...state,
          operation: payload.operation,
          previewsOperand: state.currentOperand,
          currentOperand: null
        };
      }
      if ( state.currentOperand === null )
      {
        return {
          ...state,
          operation: payload.operation
        };
      }
      return {
        ...state,
        previewsOperand: calculate( state ),
        operation: payload.operation,
        currentOperand: null
      };
    case ACTIONS.DELETE_DIGIT:
      if ( state.overwrite )
      {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        };
      }
      if ( state.currentOperand === null ) return state;
      if ( state.currentOperand.length === 1 )
      {
        return {
          ...state,
          currentOperand: null
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice( 0, -1 )
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.RESULT:
      if ( state.operation == null || state.currentOperand == null || state.previewsOperand == null )
      {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previewsOperand: null,
        operation: null,
        currentOperand: calculate( state ),
      };
    default: return type;
  };
};

const calculate = ( { currentOperand, previewsOperand, operation } ) =>
{
  const prev = parseFloat( previewsOperand );
  const curr = parseFloat( currentOperand );
  if ( isNaN( prev ) || isNaN( curr ) ) return "";
  let calculation = "";
  switch ( operation )
  {
    case "+":
      calculation = prev + curr;
      break;
    case "-":
      calculation = prev - curr;
      break;
    case "×":
      calculation = prev * curr;
      break;
    case "÷":
      calculation = prev / curr;
      break;
    case "%":
      calculation = prev % curr;
      break;
    default: calculation = "";
  }
  return calculation.toString();
};
const INTEGER_FORMATTER = new Intl.NumberFormat( "en-us", { maximumFractionDigits: 0 } );
const formatOperand = ( operand ) =>
{
  if ( operand == null ) return;
  const [ integer, decimal ] = operand.split( '.' );
  if ( decimal == null ) return INTEGER_FORMATTER.format( integer );
  return `${ INTEGER_FORMATTER.format( integer ) }.${ decimal }`;
};
const App = () =>
{
  const [ { previewsOperand, currentOperand, operation }, dispatch ] = useReducer( reducer, {} );
  return (
    <div className="calc-grid">
      <div className="output">
        <div className="prev-operand">{ formatOperand( previewsOperand ) } { operation }</div>
        <div className="curr-operand">{ formatOperand( currentOperand ) }</div>
      </div>
      <button className="span-two" onClick={ () => dispatch( { type: ACTIONS.CLEAR } ) }>AC</button>
      <button onClick={ () => dispatch( { type: ACTIONS.DELETE_DIGIT } ) }>DEL</button>
      <OperationButtons operation="%" dispatch={ dispatch } />
      <DigitButtons digit="1" dispatch={ dispatch } />
      <DigitButtons digit="2" dispatch={ dispatch } />
      <DigitButtons digit="3" dispatch={ dispatch } />
      <OperationButtons operation="÷" dispatch={ dispatch } />
      <DigitButtons digit="4" dispatch={ dispatch } />
      <DigitButtons digit="5" dispatch={ dispatch } />
      <DigitButtons digit="6" dispatch={ dispatch } />
      <OperationButtons operation="×" dispatch={ dispatch } />
      <DigitButtons digit="7" dispatch={ dispatch } />
      <DigitButtons digit="8" dispatch={ dispatch } />
      <DigitButtons digit="9" dispatch={ dispatch } />
      <OperationButtons operation="+" dispatch={ dispatch } />
      <DigitButtons digit="0" dispatch={ dispatch } />
      <DigitButtons digit="." dispatch={ dispatch } />
      <button onClick={ () => dispatch( { type: ACTIONS.RESULT } ) }>=</button>
      <OperationButtons operation="-" dispatch={ dispatch } />
    </div>
  );
};

export default App;
