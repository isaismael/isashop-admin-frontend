import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';

export const AdminLayout = () => {
  const location = useLocation();
  
  // Temporal para ver qué ruta estás visitando
  console.log('Ruta actual:', location.pathname);
  
return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar, este tiene que esar fijo */}
      <Sidebar />
      {/* Contenido scrolleable, son las pages */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <Outlet />
      </main>
    </div>
  );
};