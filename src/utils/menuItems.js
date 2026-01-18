export const menuItems = [
  {
    title: 'Dashboard',
    path: '/admin', // Cambiado para que coincida
    icon: '📊',
    permission: null
  },
  {
    title: 'Productos',
    icon: '📦',
    permission: null,
    children: [
      {
        title: 'Lista de Productos',
        path: '/admin/products',
        permission: 'product.view'
      },
      {
        title: 'Crear Producto',
        path: '/admin/products/create',
        permission: 'product.create'
      }
    ]
  },
  {
    title: 'Usuarios',
    path: '/admin/users',
    icon: '👥',
    permission: 'user.view'
  },
  {
    title: 'Configuración',
    path: '/admin/settings',
    icon: '⚙️',
    permission: 'settings.manage'
  }
];