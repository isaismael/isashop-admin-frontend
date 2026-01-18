import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_token";

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 1,
    secure: true,
    sameSite: "strict",
  });
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    // =>
    if (decoded.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      roles: decoded.roles,
      permissions: decoded.permissions,
    };
  } catch (error) {
    console.error(error);
    removeToken();
    return null;
  }
};

// => aqui voy a verificar si el usuario tiene un permiso
// especifico o no, ya que es un sistema rbac
export const hasPermission = (permission) => {
    const user = getUserFromToken();
    return user?.permissions?.includes(permission) || false;
}

// => ahora se verifica si el usuario tiene alguno de los permisos
export const hasAnyPermission = (permissions) => {
    const user = getUserFromToken();
    return permissions.some(p => user.permissions.includes(p));
}