import { usePermission } from "../hooks/usePermission";

export default function ProductActions() {
  const { can } = usePermission();

  return (
    <div className="flex gap-2">
      {can("product.update") && (
        <button className="bg-yellow-500 px-3 py-1 rounded">
          Editar
        </button>
      )}

      {can("product.delete") && (
        <button className="bg-red-600 px-3 py-1 rounded">
          Eliminar
        </button>
      )}
    </div>
  );
}
