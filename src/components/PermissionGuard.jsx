import { useAuth } from "../hooks/useAuth";

export const PermissionGuard = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return children;
};
