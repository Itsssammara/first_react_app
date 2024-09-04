
import { useReducer } from 'react';
import NumButton from './NumButton'
import OperationButton from './OperationButton'
import './App.css';
// import { type } from '@testing-library/user-event/dist/type';

export const ACTIONS ={
  ADD_NUM:' add-number',
  CHOOSE_OPERATION:'choose-operation',
  CLEAR:'clear',
  DELETE_NUM:'delete-number',
  EVALUATE:'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_NUM:
      if (payload.number === "0" && state.currentOp === "0") {
        return state;
      }
      if (payload.number === "." && state.currentOp && state.currentOp.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOp: `${state.currentOp || ""}${payload.number}`, // use state.currentOp here
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOp == null && state.prevOp == null) {
        return state;
      }
      if (state.prevOp == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOp: state.currentOp,
          currentOp: null,
        };
      }
      return {
        ...state,
        prevOp: evaluate(state),
        operation: payload.operation,
        currentOp: null,
      };

    case ACTIONS.CLEAR:
      return {};

    // evaluating the result
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

function evaluate({currentOp, prevOp, operation}) {
  const prev = parseFloat(prevOp)
  const current = parseFloat(currentOp)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
  }
  return computation.toString()
}

function App() {
  const [{ currentOp, prevOp, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='prev-op'>{prevOp}{operation}</div>
        <div className='current-op'>{currentOp}</div>
      </div>
      <button className='span-2' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} className="operation-button" />
      <NumButton number="1" dispatch={dispatch} />
      <NumButton number="2" dispatch={dispatch} />
      <NumButton number="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} className="operation-button"/>
      <NumButton number="4" dispatch={dispatch} />
      <NumButton number="5" dispatch={dispatch} />
      <NumButton number="6" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} className="operation-button"/>
      <NumButton number="7" dispatch={dispatch} />
      <NumButton number="8" dispatch={dispatch} />
      <NumButton number="9" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} className="operation-button"/>
      <NumButton number="." dispatch={dispatch} />
      <NumButton number="0" dispatch={dispatch} />
      <button className='span-2' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>

    </div>
  );
}


export default App;
