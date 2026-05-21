import { createContext, useContext, useReducer, useEffect } from 'react';

const KEY = 'fow_vlogs';
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
};

function reducer(state, { type, payload }) {
  switch (type) {
    case 'SAVE_VLOG':
      return [payload, ...state];
    case 'DELETE_VLOG':
      return state.filter(v => v.id !== payload);
    case 'ADD_SPOT':
      return state.map(v =>
        v.id !== payload.vlogId ? v : {
          ...v,
          spots: [...v.spots, payload.spot].sort((a, b) => a.timestamp - b.timestamp),
        }
      );
    case 'DELETE_SPOT':
      return state.map(v =>
        v.id !== payload.vlogId ? v : {
          ...v,
          spots: v.spots.filter(s => s.id !== payload.spotId),
        }
      );
    default:
      return state;
  }
}

const VlogCtx = createContext(null);

export function VlogProvider({ children }) {
  const [vlogs, dispatch] = useReducer(reducer, null, load);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(vlogs));
  }, [vlogs]);
  return <VlogCtx.Provider value={{ vlogs, dispatch }}>{children}</VlogCtx.Provider>;
}

export const useVlogs = () => useContext(VlogCtx);
