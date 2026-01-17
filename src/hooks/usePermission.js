import { useAuth } from "./useAuth";

export const usePermission = () => {
  const { user } = useAuth();

  const can = (permission) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  return { can };
};
