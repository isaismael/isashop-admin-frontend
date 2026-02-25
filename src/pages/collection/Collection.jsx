import { Save, Trash, SquarePen, Frown, Layers, PackagePlus } from "lucide-react";
import { useState, useEffect } from "react";
import CollectionService from "../../services/collection.service";
import { CollectionProducts } from "../collectionproducts/Collectionproducts";

export const Collection = () => {
  const initialForm = {
    name: "",
    description: "",
    active: 1,
  };

  const [form, setForm] = useState(initialForm);
  const [collections, setCollections] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null); // 👈 nueva sección

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setForm((prev) => ({
      ...prev,
      active: prev.active === 1 ? 0 : 1,
    }));
  };

  const discardCollection = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const getCollections = async () => {
    try {
      const service = new CollectionService();
      const response = await service.getAllCollections();
      setCollections(response || []);
    } catch (error) {
      console.error("Error en getCollections:", error.message);
      setCollections([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const service = new CollectionService();
      if (editingId) {
        await service.updateCollection(editingId, form);
        alert("Colección actualizada correctamente");
      } else {
        await service.createCollection(form);
        alert("Colección creada correctamente");
      }
      discardCollection();
      getCollections();
    } catch (error) {
      console.error("Error al guardar colección:", error);
      alert(error.message);
    }
  };

  const handleEdit = (collection) => {
    setForm({
      name: collection.name,
      description: collection.description,
      active: collection.active,
    });
    setEditingId(collection.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta colección?")) return;
    try {
      const service = new CollectionService();
      await service.deleteCollection(id);
      alert("Colección eliminada correctamente");
      getCollections();
    } catch (error) {
      console.error("Error al eliminar colección:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  // Si hay una colección seleccionada, mostrar la sección de productos
  if (selectedCollection) {
    return (
      <CollectionProducts
        collection={selectedCollection}
        onBack={() => setSelectedCollection(null)}
      />
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Gestor de colecciones</h2>
      <p className="text-slate-500">
        Administre las colecciones de productos para organizar su catálogo.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={discardCollection}
              className="flex items-center gap-2 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-500 hover:text-white rounded-lg transition"
            >
              <Trash size={18} />
              Descartar
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#6366f1] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              <Save size={18} />
              {editingId ? "Actualizar Colección" : "Crear Colección"}
            </button>
          </div>
        </div>

        <div className="w-full flex gap-3">
          <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-6">
                Detalles de la colección
              </h2>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-500">
                  {form.active === 1 ? "Activo" : "Inactivo"}
                </span>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.active === 1}
                    onChange={handleToggle}
                  />
                  <div className="w-11 h-6 rounded-full transition-colors bg-[#e2e8f0] peer-checked:bg-[#6366f1] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nombre de la colección
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Ej. Verano 2025, Invierno clásico, etc."
                  required
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Descripción
                </label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  type="text"
                  placeholder="Ej. Ropa de temporada para el verano."
                  required
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1]"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="w-full flex gap-3 mt-4">
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Listado de colecciones</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {Array.isArray(collections) && collections.length > 0 ? (
                  collections.map((collection) => (
                    <tr
                      key={collection.id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                        {collection.id}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                            <Layers size={16} />
                          </div>
                          <span className="text-sm font-semibold text-slate-800">
                            {collection.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                        {collection.description}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            collection.active === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {collection.active === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {/* 👇 Nuevo botón para gestionar productos */}
                          <button
                            type="button"
                            onClick={() => setSelectedCollection(collection)}
                            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition"
                            title="Gestionar productos"
                          >
                            <PackagePlus size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(collection)}
                            className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
                            title="Editar colección"
                          >
                            <SquarePen size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(collection.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                            title="Eliminar colección"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        No hay colecciones disponibles
                        <Frown size={18} />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};