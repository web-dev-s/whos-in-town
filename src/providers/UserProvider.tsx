import React, { useRef, type PropsWithChildren } from "react";
import {
  UserContext,
  defaultUserContextValue,
  type IUserContext,
} from "../contexts/UserContext";

export const UserProvider = function (
  props: PropsWithChildren,
): React.ReactElement {
  const contextValue = useRef<IUserContext>(defaultUserContextValue);

  return (
    // eslint-disable-next-line react-hooks/refs
    <UserContext.Provider value={contextValue.current}>
      {props.children}
    </UserContext.Provider>
  );
};
