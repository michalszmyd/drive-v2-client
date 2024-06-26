import React from "react";
import UserModel from "../models/user-model";

const CurrentUserContext = React.createContext<{
  currentUser: UserModel | null;
  setCurrentUser: (state: UserModel) => void;
}>({
  currentUser: null,
  setCurrentUser: () => {},
});

export default CurrentUserContext;
