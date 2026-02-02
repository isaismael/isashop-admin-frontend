import {Package, LayoutDashboard } from 'lucide-react'

export const menuItems = [
  {
    title: 'Dashboard',
    path: '/admin', // Cambiado para que coincida
    icon: <LayoutDashboard />,
    permission: null
  },
  {
    title: 'Productos',
    icon: <Package />,
    permission: null,
    children: [
      {
        title: 'Lista de Productos',
        path: '/admin/products/listproducts',
        permission: 'product.read'
      },
      {
        title: 'Crear Producto',
        path: '/admin/products/create',
        permission: 'product.create'
      },
      {
        title: 'Categorias',
        path: '/admin/products/category',
        permission: 'product.create'
      },
      {
        title: 'Marcas',
        path: '/admin/products/brands',
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