import {ACTIONS} from './App'

export default function NumButton({dispatch,number}){
  return (
  <button onClick={() => dispatch({type: ACTIONS.ADD_NUM, payload: {number} })}>{number}</button>  
  )
}