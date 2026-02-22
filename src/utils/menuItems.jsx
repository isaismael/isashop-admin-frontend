import { Package, LayoutDashboard, Warehouse } from 'lucide-react'

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
      // {
      //   title: 'Lista de Productos',
      //   path: '/admin/products/listproducts',
      //   permission: 'product.read'
      // },
      {
        title: 'Catalogo',
        path: '/admin/products/create',
        permission: 'product.create'
      },
      {
        title: 'Marcas',
        path: '/admin/products/brands',
        permission: 'product.create'
      },
      {
        title: 'Categorias',
        path: '/admin/products/category',
        permission: 'product.create'
      },
      {
        title: 'Colores',
        path: '/admin/products/colors',
        permission: 'product.create'
      },
      {
        title: 'Tallas',
        path: '/admin/products/sizes',
        permission: 'product.create'
      },
    ]
  },
  {
    title: 'Pedidos',
    path: '/admin/orders',
    icon: <Warehouse />,
    children:
    [
      {
        title: 'WareHouse',
        path: '/admin/warehouse/warehouse',
        permission: 'product.create'
      },
      {
        title: 'Stock',
        path: '/admin/warehouse/stock',
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