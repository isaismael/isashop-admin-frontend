import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';

export const AdminLayout = () => {
  const location = useLocation();
  
  // Temporal para ver qué ruta estás visitando
  console.log('Ruta actual:', location.pathname);
  
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};