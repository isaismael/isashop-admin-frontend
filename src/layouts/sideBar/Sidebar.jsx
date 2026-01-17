import { Link } from "react-router-dom";
import { usePermission } from "../../hooks/usePermission";

const MENU = [
  {
    label: "Productos",
    path: "/products",
    permissions: ["product.create", "product.update", "product.delete"],
  },
  {
    label: "Crear producto",
    path: "/products/new",
    permissions: ["product.create"],
  },
];

export default function Sidebar() {
  const { can } = usePermission();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4">
      <ul className="space-y-2">
        {MENU.filter((item) =>
          item.permissions.some((p) => can(p))
        ).map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="block px-3 py-2 rounded hover:bg-gray-700"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
