import { Package, LayoutDashboard, Warehouse, Truck, HandCoins, TvMinimal, UserStar, FileUser } from 'lucide-react'

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
        title: 'Catalogo',
        path: '/admin/products/create',
        permission: 'product.create'
      },
      {
        title: 'Colecciones',
        path: '/admin/products/collections',
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
    title: 'Inventario',
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
    title: 'Envios',
    path: '/admin/shipping',
    icon: <Truck />,
    children:
    [
      {
        title: 'Lugares de envio',
        path: '/admin/shipping/provinces',
        permission: 'product.create'
      },
      {
        title: 'Shipping Cost',
        path: '/admin/shipping/shippingcost',
        permission: 'product.create'
      },
      {
        title: 'Pickup Address',
        path: '/admin/shipping/pickupaddress',
        permission: 'product.create'
      }
    ]
  },
  {
    title: 'Orders',
    path: '/admin/orders',
    icon: <HandCoins />,
    children:
    [
      {
        title: 'Ordenes de pago',
        path: '/admin/orders/paymentorders',
        permission: 'product.create'
      },
      {
        title: 'Metodos de pago',
        path: '/admin/orders/paymentmethods',
        permission: 'product.create'
      }
    ]
  },
  {
    title: 'StoreFront',
    path: '/admin/storefront',
    icon: <TvMinimal />,
    children:
    [
      {
        title: 'Banner',
        path: '/admin/storefront/banner',
        permission: 'product.create'
      },
      {
        title: 'Category Bubbles',
        path: '/admin/storefront/categorybubbles',
        permission: 'product.create'
      },
      {
        title: 'Product Grid',
        path: '/admin/storefront/productgrid',
        permission: 'product.create'
      },
      {
        title: 'Promo Banner',
        path: '/admin/storefront/promobanner',
        permission: 'product.create'
      }
    ]
  },
  {
    title: 'Customers',
    path: '/admin/customer',
    icon: <FileUser />,
    permission: 'product.create'
  },
  {
    title: 'Administrador',
    path: '/admin/administrador',
    icon: <UserStar />,
    permission: 'product.create'
  },
];