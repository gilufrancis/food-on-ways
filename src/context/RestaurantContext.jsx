import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadRestaurants, saveRestaurants } from '../utils/localStorage';

const RestaurantContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_RESTAURANT': {
      const next = [...state, action.payload];
      saveRestaurants(next);
      return next;
    }
    case 'EDIT_RESTAURANT': {
      const next = state.map((r) =>
        r.id === action.payload.id ? { ...r, ...action.payload } : r
      );
      saveRestaurants(next);
      return next;
    }
    case 'DELETE_RESTAURANT': {
      const next = state.filter((r) => r.id !== action.payload);
      saveRestaurants(next);
      return next;
    }
    case 'TOGGLE_STATUS': {
      const next = state.map((r) =>
        r.id === action.payload
          ? { ...r, status: r.status === 'wishlist' ? 'visited' : 'wishlist' }
          : r
      );
      saveRestaurants(next);
      return next;
    }
    default:
      return state;
  }
}

export function RestaurantProvider({ children }) {
  const [restaurants, dispatch] = useReducer(reducer, [], loadRestaurants);

  return (
    <RestaurantContext.Provider value={{ restaurants, dispatch }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurants() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurants must be used within RestaurantProvider');
  return ctx;
}
