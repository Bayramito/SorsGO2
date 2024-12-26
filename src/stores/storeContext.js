import React, {createContext, useContext} from 'react';

const StoreContext = createContext();

export const StoreProvider = ({children}) => {
  const stores = {};

  return (
    <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
