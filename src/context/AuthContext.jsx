import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import { setToken, removeToken, getUserFromToken } from "../utils/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromToken());
  const navigate = useNavigate();

  //función de login
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);

      // -> seteo el token
      setToken(data.token);
      // -> decodificamos el token y guardamos el usuario
      const userData = getUserFromToken();
      setUser(userData);
      console.log('User set after login:', userData);
      // -> enviamos al usuario al panel de admin
      navigate("/admin");
      // -> retornamos
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  // -> función de logout
  const logout = () => {
    removeToken();
    setUser(null);
    navigate("/login");
  };

  // -> esta funcion es para verificar si tiene permisos
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
