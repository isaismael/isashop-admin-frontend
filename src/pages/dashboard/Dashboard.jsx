import { useAuth } from "../../hooks/useAuth";

export const Dashboard = () => {
  const { user } = useAuth();

  console.log("User in Dashboard:", user);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-2xl font-bold mb-1">
          Bienvenido,{" "}
          <strong className="text-blue-600 underline underline-offset-4 decoration-2">
            {user?.email}
          </strong>
        </p>
        <span className="text-slate-500 dark:text-slate-400">
          Administre su tienda y supervise el rendimiento en tiempo real.
        </span>
        <div className="mt-4 flex flex-wrap gap-2">
          <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800  border border-slate-200 ">
            Role: {user?.roles?.join(", ")}
          </p>

          <div className="flex flex-wrap gap-2">
            {user?.permissions?.map((permission) => (
              <span
                key={permission}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200 "
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
