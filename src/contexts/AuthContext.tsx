import React, { createContext, useContext, useState } from "react";
import { api, getToken, clearToken } from "@/lib/api";

type AuthCtx = {
  user: string | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
};
const AuthContext = createContext<AuthCtx>({} as any);

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
  const [user,setUser] = useState<string | null>(getToken() ? "Usuario" : null);

  async function login(username: string, password: string) {
    await api.login(username, password);
    setUser(username);
  }
  function logout() {
    clearToken();
    setUser(null);
  }
  return <AuthContext.Provider value={{user,login,logout}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
