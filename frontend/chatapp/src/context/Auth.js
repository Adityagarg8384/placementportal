import { createContext, useContext } from "react";

export const FileContext = createContext({
  user: null,
  updateUser: () => {},
  post:null,
  updatePost:()=>{},
  role:"student",
  updateRole:()=>{},
});

export const FileProvider = FileContext.Provider;

export const useFileContext = () => {
  return useContext(FileContext);
};
