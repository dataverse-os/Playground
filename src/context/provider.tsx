import { ReactNode, useReducer } from "react";
import { initialState, reducer } from "./state";
import { PlaygroundContext } from "./usePlaygroundStore";

export const PlaygroundContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PlaygroundContext.Provider value={{ state, dispatch }}>
      {children}
    </PlaygroundContext.Provider>
  );
};
