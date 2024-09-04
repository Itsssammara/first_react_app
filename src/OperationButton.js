import {ACTIONS} from './App'

export default function OperationButton({dispatch,operation}){
  return (
  <button 
    classname={OperationButton}
    onClick={() => dispatch({type:ACTIONS.CHOOSE_OPERATION, payload:{operation} })}
    >
      {operation}
    </button>  
  )
}