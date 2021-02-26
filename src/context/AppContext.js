import React, { useReducer, createContext } from 'react';
import { initialState } from '../store/initialState';
import reducer from '../reducer/reducer';

const context = createContext();
function AppContext({ children }) {
    const [store, dispatch] = useReducer(reducer, initialState);
    return (
        <context.Provider value={{ store, dispatch }}>
            {children}
        </context.Provider>
    );
}

export default AppContext;
export { context };