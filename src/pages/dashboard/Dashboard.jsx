import { useAuth } from "../../hooks/useAuth";

export const Dashboard = () => {
  const { user } = useAuth();

  console.log('User in Dashboard:', user);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="mb-2">Bienvenido, <strong>{user?.email}</strong></p>
        <p className="text-sm text-gray-600 mb-4">
          Roles: {user?.roles?.join(', ')}
        </p>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Tus permisos:</h3>
          <div className="flex flex-wrap gap-2">
            {user?.permissions?.map(permission => (
              <span
                key={permission}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};