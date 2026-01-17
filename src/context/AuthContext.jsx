// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        Cookies.remove("token");
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser({
          id: decoded.sub,
          email: decoded.email,
          roles: decoded.roles,
          permissions: decoded.permissions,
        });
      }
    }

    setLoading(false);
  }, []);

  const login = (token) => {
    Cookies.set("token", token, { sameSite: "strict" });
    const decoded = jwtDecode(token);

    setUser({
      id: decoded.sub,
      email: decoded.email,
      roles: decoded.roles,
      permissions: decoded.permissions,
    });
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);
