import { useReducer, useEffect } from 'react';
import NumButton from './NumButton'
import OperationButton from './OperationButton'
import './App.css';

// Define action types for the reducer
export const ACTIONS ={
  ADD_NUM:' add-number',
  CHOOSE_OPERATION:'choose-operation',
  CLEAR:'clear',
  DELETE_NUM:'delete-number',
  EVALUATE:'evaluate'
}

// The reducer function updates the state based on the action type and payload
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_NUM:
      // If adding a number and the currentOp is "0", replace it with the new number
      if (state.currentOp === "0" && payload.number !== ".") {
        return {
          ...state,
          currentOp: payload.number,
        };
      }
      // Prevent adding multiple decimal points
      if (payload.number === "." && state.currentOp.includes(".")) {
        return state;
      }
      // Append the number to the current operation
      return {
        ...state,
        currentOp: `${state.currentOp || ""}${payload.number}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      // If there's no currentOp or prevOp, do nothing
      if (state.currentOp == null && state.prevOp == null) {
        return state;
      }
 // If no previous operation, set the operation and save the current operation
      if (state.prevOp == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOp: state.currentOp,
          currentOp: "0", // Reset currentOp to "0" when a new operation is chosen
        };
      }

 // If there is a previous operation, calculate the result and set the new operation
      return {
        ...state,
        prevOp: evaluate(state),
        operation: payload.operation,
        currentOp: "0", // Reset currentOp to "0" after evaluating
      };

    case ACTIONS.CLEAR:
      // Reset all state to initial values
      return {
        currentOp: "0",
        prevOp: null,
        operation: null,
      };

    case ACTIONS.DELETE_NUM:
      if (state.currentOp.length > 1) {
        // Remove the last character or reset to"0" if empty
        return {
          ...state,
          currentOp: state.currentOp.slice(0, -1) || "0", // Reset to "0" if empty
        };
      }
      if (state.currentOp.length === 1) {
        return {
          ...state,
          currentOp: "0",
        };
      }
      return state;

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOp == null || state.prevOp == null) {
        return state;
      }
      return {
        ...state,
        prevOp: null,
        operation: null,
        currentOp: evaluate(state),
      };

    default:
      return state;
  }
}



function evaluate({ currentOp, prevOp, operation }) {
  const prev = parseFloat(prevOp);
  const current = parseFloat(currentOp);
  
  if (isNaN(prev) || isNaN(current)) return "Error";

  switch (operation) {
    case "+":
      return (prev + current).toString();
    case "-":
      return (prev - current).toString();
    case "*":
      return (prev * current).toString();
    case "/":
      return current === 0 ? "Error" : (prev / current).toString();
    default:
      return "";
  }
}


function App() {
  const [{ currentOp, prevOp, operation }, dispatch] = useReducer(reducer, { currentOp: "0" });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isNaN(e.key)) {
        dispatch({ type: ACTIONS.ADD_NUM, payload: { number: e.key } });
      } else if (e.key === '.') {
        dispatch({ type: ACTIONS.ADD_NUM, payload: { number: '.' } });
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: e.key } });
      } else if (e.key === 'Enter') {
        dispatch({ type: ACTIONS.EVALUATE });
      } else if (e.key === 'Escape') {
        dispatch({ type: ACTIONS.CLEAR });
      } else if (e.key === 'Backspace') {
        dispatch({ type: ACTIONS.DELETE_NUM });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='prev-op'>{prevOp}{operation}</div>
        <div className='current-op'>{currentOp}</div>
      </div>
      <button aria-label="Clear" className='span-2' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_NUM })}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} className="operation-button" />
      <NumButton number="1" dispatch={dispatch} />
      <NumButton number="2" dispatch={dispatch} />
      <NumButton number="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} className="operation-button" />
      <NumButton number="4" dispatch={dispatch} />
      <NumButton number="5" dispatch={dispatch} />
      <NumButton number="6" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} className="operation-button" />
      <NumButton number="7" dispatch={dispatch} />
      <NumButton number="8" dispatch={dispatch} />
      <NumButton number="9" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} className="operation-button" />
      <NumButton number="." dispatch={dispatch} />
      <NumButton number="0" dispatch={dispatch} />
      <button className='span-2' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}



export default App;
