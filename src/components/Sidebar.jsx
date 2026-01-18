import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { menuItems } from '../utils/menuItems';
import { useState } from 'react';

export const Sidebar = () => {
  const { hasPermission, user, logout } = useAuth();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});

  // Filtrar items según permisos
  const filterMenuItems = (items) => {
    return items.filter(item => {
      // Si no requiere permiso, mostrar
      if (!item.permission) {
        // Si tiene hijos, filtrarlos también
        if (item.children) {
          item.children = filterMenuItems(item.children);
          return item.children.length > 0; // Solo mostrar si tiene hijos visibles
        }
        return true;
      }
      // Si requiere permiso, verificar
      return hasPermission(item.permission);
    });
  };

  const visibleItems = filterMenuItems(menuItems);

  const toggleSubmenu = (title) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        {visibleItems.map((item) => (
          <div key={item.title} className="mb-2">
            {item.children ? (
              // Item con submenú
              <div>
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-700 transition"
                >
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <span className="text-xs">
                    {openSubmenus[item.title] ? '▼' : '▶'}
                  </span>
                </button>
                
                {openSubmenus[item.title] && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-3 py-2 rounded text-sm hover:bg-gray-700 transition ${
                          location.pathname === child.path ? 'bg-gray-700' : ''
                        }`}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Item simple
              <Link
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition ${
                  location.pathname === item.path ? 'bg-gray-700' : ''
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};