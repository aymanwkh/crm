import { iState, iAction } from './interfaces'

const Reducer = (state: iState, action: iAction) => {
  switch (action.type){
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: undefined,
      }
    default:
      return state
  }
}

export default Reducer