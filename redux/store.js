import {createStore, combineReducers} from 'redux';
import { gpReducer } from './gpReducer';
import { menuReducer } from './menuReducer';
import { authReducer } from './authReducer';


export const store = createStore(
                            combineReducers({"main": gpReducer, "menu": menuReducer, "auth": authReducer}), 
                            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());