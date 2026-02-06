import { useState } from "react";

export const Brands = () => {

  const [enabled, setEnabled] = useState(true);

  return (
    <div>
      {/* header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Gestor de marcas</h2>
        <p className="text-slate-500">Defina información clave de la marca y recursos visualmente enriquecidos para lograr una exhibición atractiva.</p>
      </div>
      {/* fin header */}
      <div className="w-full flex flex-row justify-between items-center gap-3">
        <div className="w-1/2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold mb-6">Detalles de la marca</h2>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {enabled ? "Active" : "Inactive"}
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={enabled}
                  onChange={() => setEnabled(!enabled)}
                />

                <div
                  className="
                            w-11 h-6 rounded-full transition-colors
                            bg-[#e2e8f0]               
                            peer-checked:bg-[#6366f1]
                            after:content-['']
                            after:absolute after:top-[2px] after:left-[2px]
                            after:h-5 after:w-5 after:rounded-full
                            after:bg-white after:transition-all
                            peer-checked:after:translate-x-full
                          "
                ></div>
              </label>
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Nommbre de la marca
            </label>
            <input
              type="search"
              placeholder="Ej. Nike, Apple, Samsung, etc."
              className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm 
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                 transition"
            />
          </div>
        </div>
        <div className="w-1/2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="">
            <h2 className="text-lg font-semibold mb-6">Image de la marca</h2>
            <label className="block text-sm font-medium text-slate-700 mb-3">Subir logo</label> 
            <input type="file" name="" id="" />
          </div>
        </div>
      </div>
    </div>
  )
}
