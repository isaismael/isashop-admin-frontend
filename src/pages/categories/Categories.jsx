import { Folder, FolderOpen, FolderTree, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import DepartmentsService from "../../services/departments.service";
import CategoryService from "../../services/category.service";
import SubcategoryService from "../../services/subcategory.service";

export const Categories = () => {
  const [mode, setMode] = useState("department");

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const [departmentName, setDepartmentName] = useState("");
  const [departmentActive, setDepartmentActive] = useState(true);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryActive, setCategoryActive] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryActive, setSubcategoryActive] = useState(true);

  const [categoryTree, setCategoryTree] = useState([]);

  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const departmentsService = new DepartmentsService();
  const categoryService = new CategoryService();
  const subcategoryService = new SubcategoryService();

  const fetchCategoryTree = async (page, limit) => {
    try {
      const response = await departmentsService.getCategoryTree(page, limit);

      setCategoryTree(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error en categoryTree: ", error.message);
    }
  };

  const fetchDepartments = async () => {
    const response = await departmentsService.getAllDepartments();
    setDepartments(response);
  };

  const fetchCategories = async () => {
    const response = await categoryService.getallCategories();
    setCategories(response);
  };

  useEffect(() => {
    fetchCategoryTree(page, limit);
    fetchDepartments();
    fetchCategories();
  }, [page, limit]);

  const resetForm = () => {
    setDepartmentName("");
    setCategoryName("");
    setSubcategoryName("");
    setSelectedDepartment("");
    setSelectedCategory("");
  };

  const handleSave = async () => {
    try {
      if (mode === "department") {
        await departmentsService.createDepartment({
          name: departmentName,
          active: departmentActive,
        });
      }

      if (mode === "category") {
        await categoryService.createCategory({
          name: categoryName,
          departament_id: Number(selectedDepartment),
          active: 1,
        });
      }

      if (mode === "subcategory") {
        await subcategoryService.createSubcategory({
          name: subcategoryName,
          active: subcategoryActive,
          category_id: selectedCategory,
        });
      }

      await fetchDepartments();
      await fetchCategories();
      await fetchCategoryTree(page, limit);
      resetForm();

      alert("Creado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  const isDepartmentMode = mode === "department";
  const isCategoryMode = mode === "category";
  const isSubcategoryMode = mode === "subcategory";

  return (
    <div>
      <h2 className="text-2xl font-bold">
        Gestión de Departamentos y Categorías
      </h2>
      <p className="text-slate-500">
        Administra la jerarquía completa de tu tienda.
      </p>

      {/* BOTONES SUPERIORES */}
      <div className="flex justify-between mt-6 mb-4">
        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => {
              setMode("department");
              resetForm();
            }}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${
              isDepartmentMode
                ? "border-[#6366f1] text-[#6366f1]"
                : "border-transparent text-slate-500 hover:text-[#6366f1]"
            }`}
          >
            Nuevo Departamento
          </button>

          <button
            onClick={() => {
              setMode("category");
              resetForm();
            }}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${
              isCategoryMode
                ? "border-[#6366f1] text-[#6366f1]"
                : "border-transparent text-slate-500 hover:text-[#6366f1]"
            }`}
          >
            Nueva Categoría
          </button>

          <button
            onClick={() => {
              setMode("subcategory");
              resetForm();
            }}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${
              isSubcategoryMode
                ? "border-[#6366f1] text-[#6366f1]"
                : "border-transparent text-slate-500 hover:text-[#6366f1]"
            }`}
          >
            Nueva Subcategoría
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-500 hover:text-white rounded-lg transition"
          >
            <Trash size={18} />
            Descartar
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#6366f1] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <Save size={18} />
            Guardar
          </button>
        </div>
      </div>

      {/* FORMULARIO */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* departamento */}
          <div className="space-y-4 opacity-100">
            <label className="text-sm font-semibold text-slate-700">
              1. Departamento
            </label>

            <input
              disabled={!isDepartmentMode}
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full h-10 p-2 bg-slate-50 border-slate-200 rounded-lg text-sm disabled:opacity-40"
              placeholder="Ej. Tecnología"
            />
          </div>

          {/* categoria */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700">
              2. Categoría
            </label>

            <select
              disabled={!isCategoryMode}
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full h-10 p-2 bg-slate-50 border-slate-200 rounded-lg text-sm disabled:opacity-40"
            >
              <option value="">Selecciona un departamento</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>

            <input
              disabled={!isCategoryMode}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full h-10 p-2 bg-slate-50 border-slate-200 rounded-lg text-sm disabled:opacity-40"
              placeholder="Nombre categoría"
            />
          </div>

          {/* subcateogira */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700">
              3. Subcategoría
            </label>

            <select
              disabled={!isSubcategoryMode}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 p-2 bg-slate-50 border-slate-200 rounded-lg text-sm disabled:opacity-40"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              disabled={!isSubcategoryMode}
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              className="w-full h-10 p-2 bg-slate-50 border-slate-200 rounded-lg text-sm disabled:opacity-40"
              placeholder="Nombre subcategoría"
            />
          </div>
        </div>
      </div>

      {/* Arbol de categorias */}
      <div className="w-full flex gap-3 mt-4">
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Árbol de Categorías</h3>
          <div className="overflow-x-auto">
            <pre className="bg-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <div className="space-y-4">
                {categoryTree?.map((department) => (
                  <div
                    key={department.id}
                    className="border rounded-lg p-4 bg-slate-50"
                  >
                    {/* DEPARTAMENTO */}
                    <div className="flex items-center gap-2 font-bold text-indigo-600 text-lg">
                      <FolderTree size={20} /> {department.name}
                    </div>

                    {/* CATEGORIAS */}
                    <div className="ml-6 mt-3 space-y-2">
                      {department.categories?.map((category) => (
                        <div key={category.id}>
                          <div className="flex items-center gap-2 font-semibold text-slate-700">
                            <FolderOpen size={15} /> {category.name}
                          </div>

                          {/* SUBCATEGORIAS */}
                          <div className="ml-10 mt-1 space-y-1">
                            {category.subcategories?.map((subcategory) => (
                              <div
                                key={subcategory.id}
                                className="flex items-center gap-2 text-slate-500 text-sm"
                              >
                                <FolderOpen size={15} /> {subcategory.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </pre>
          </div>
        </div>
      </div>
      {pagination && (
        <div className="sticky bottom-0 w-full flex justify-between items-center gap-4 mt-6 bg-white border border-gray-200 px-6 py-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded disabled:opacity-50 hover:bg-slate-200 transition"
            >
              Anterior
            </button>

            <span className="text-gray-600 font-semibold">
              Página {pagination.page} de {pagination.totalPages}
            </span>

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded disabled:opacity-50 hover:bg-slate-200 transition"
            >
              Siguiente
            </button>
          </div>

          <div>
            <span className="text-gray-500 font-semibold">
              Total registros: {pagination.total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
