import { useState, useEffect, useCallback } from "react";
import * as adminService from "../../services/admin.service";

// -> ICONS (inline SVG, no deps)
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IUser = () => <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />;
const IRole = () => <Icon d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />;
const IKey = () => <Icon d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />;
const IPlus = () => <Icon d="M12 5v14M5 12h14" />;
const IEdit = () => <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const ITrash = () => <Icon d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3-3h6a2 2 0 0 1 2 2H5a2 2 0 0 1 2-2z" />;
const IClose = () => <Icon d="M18 6L6 18M6 6l12 12" />;
const ICheck = () => <Icon d="M20 6L9 17l-5-5" />;
const IShield = () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;

// -> THEME
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #18181f;
    --border: #2a2a38;
    --accent: #7c6af7;
    --accent-dim: #7c6af720;
    --accent2: #f76a8c;
    --text: #e8e8f0;
    --text-muted: #6b6b80;
    --green: #4ade80;
    --red: #f87171;
    --yellow: #fbbf24;
    --radius: 10px;
    --font: 'Syne', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  .admin-root {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Header */
  .admin-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 32px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .admin-header-logo {
    width: 36px; height: 36px;
    background: var(--accent);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .admin-header h1 {
    font-size: 1.1rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
  }
  .admin-header span {
    font-size: 0.72rem; color: var(--text-muted); font-family: var(--mono); margin-left: auto;
    background: var(--surface2); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border);
  }

  /* Tabs */
  .admin-tabs {
    display: flex; gap: 4px;
    padding: 16px 32px 0;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .tab-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 20px;
    border: none; background: none; cursor: pointer;
    color: var(--text-muted); font-family: var(--font); font-size: 0.88rem; font-weight: 600;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
    transition: all 0.2s; letter-spacing: 0.02em;
  }
  .tab-btn:hover { color: var(--text); }
  .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* Main layout */
  .admin-body { flex: 1; padding: 28px 32px; display: flex; flex-direction: column; gap: 24px; }

  /* Toolbar */
  .toolbar { display: flex; align-items: center; gap: 12px; }
  .toolbar-title { font-size: 1.3rem; font-weight: 700; flex: 1; }
  .search-box {
    padding: 9px 14px; background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); color: var(--text); font-family: var(--font); font-size: 0.85rem;
    width: 220px; outline: none; transition: border-color 0.2s;
  }
  .search-box:focus { border-color: var(--accent); }
  .btn {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 16px; border-radius: var(--radius); font-family: var(--font);
    font-size: 0.85rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #6b5ae6; }
  .btn-ghost { background: var(--surface2); color: var(--text-muted); border: 1px solid var(--border); }
  .btn-ghost:hover { color: var(--text); border-color: var(--accent); }
  .btn-danger { background: transparent; color: var(--red); border: 1px solid transparent; }
  .btn-danger:hover { background: #f8717120; border-color: var(--red); }
  .btn-sm { padding: 5px 10px; font-size: 0.78rem; }

  /* Table */
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--surface2); }
  th { padding: 12px 16px; text-align: left; font-size: 0.75rem; font-weight: 600;
       color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
  td { padding: 14px 16px; border-top: 1px solid var(--border); font-size: 0.88rem; vertical-align: middle; }
  tr:hover td { background: var(--surface2); }

  /* Badges */
  .badge-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 20px; font-size: 0.73rem; font-weight: 600;
    font-family: var(--mono); letter-spacing: 0.02em;
  }
  .badge-role { background: var(--accent-dim); color: var(--accent); border: 1px solid var(--accent)40; }
  .badge-perm { background: #f76a8c15; color: var(--accent2); border: 1px solid var(--accent2)40; }
  .badge-key  { background: #fbbf2415; color: var(--yellow); border: 1px solid var(--yellow)40; }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
  .dot-on { background: var(--green); box-shadow: 0 0 6px var(--green); }
  .dot-off { background: var(--text-muted); }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: #00000090; backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; z-index: 100;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } }
  .modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 28px; width: 480px; max-width: 96vw; max-height: 90vh; overflow-y: auto;
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } }
  .modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
  .modal-header h2 { font-size: 1.1rem; font-weight: 700; flex: 1; }
  .modal-header button { background: none; border: none; color: var(--text-muted); cursor: pointer; }
  .modal-header button:hover { color: var(--text); }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--text-muted);
                       text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
  .form-input {
    width: 100%; padding: 10px 12px; background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); color: var(--text); font-family: var(--font); font-size: 0.88rem;
    outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--accent); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }

  /* Checkbox grid */
  .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .checkbox-item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border);
    cursor: pointer; transition: all 0.15s;
  }
  .checkbox-item:hover { border-color: var(--accent); background: var(--accent-dim); }
  .checkbox-item.selected { border-color: var(--accent); background: var(--accent-dim); }
  .checkbox-item input { accent-color: var(--accent); cursor: pointer; }
  .checkbox-item span { font-size: 0.8rem; font-family: var(--mono); }

  /* Empty state */
  .empty { text-align: center; padding: 48px; color: var(--text-muted); font-size: 0.9rem; }

  /* Toast */
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 200;
    padding: 12px 20px; border-radius: 10px; font-size: 0.85rem; font-weight: 600;
    display: flex; align-items: center; gap: 10px;
    animation: slideUp 0.2s ease;
  }
  .toast-success { background: #4ade8020; border: 1px solid var(--green); color: var(--green); }
  .toast-error   { background: #f8717120; border: 1px solid var(--red);   color: var(--red); }

  /* Loading */
  .spinner {
    width: 20px; height: 20px; border: 2px solid var(--border);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.7s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-row td { text-align: center; padding: 32px; }

  .actions-cell { display: flex; gap: 4px; }
`;

// -> TOAST
const Toast = ({ msg, type }) => msg ? (
  <div className={`toast toast-${type}`}>
    {type === "success" ? <ICheck /> : <IClose />} {msg}
  </div>
) : null;

// -> MODAL
const Modal = ({ title, onClose, children, icon }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div className="modal-header">
        {icon}
        <h2>{title}</h2>
        <button onClick={onClose}><IClose /></button>
      </div>
      {children}
    </div>
  </div>
);

// -> USERS TAB
const UsersTab = ({ showToast }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "create" | "edit"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", last_name: "", email: "", password: "", role_ids: [] });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([adminService.getUsers(), adminService.getRoles()]);
      setUsers(u); setRoles(r);
    } catch { showToast("Error al cargar usuarios", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ name: "", last_name: "", email: "", password: "", role_ids: [] });
    setModal("create");
  };
  const openEdit = (u) => {
    setSelected(u);
    setForm({ name: u.name, last_name: u.last_name, email: u.email, password: "", role_ids: u.roles?.map((r) => r.id) || [] });
    setModal("edit");
  };

  const handleSubmit = async () => {
    try {
      if (modal === "create") await adminService.createUser(form);
      else await adminService.updateUser(selected.id, form);
      showToast(modal === "create" ? "Usuario creado" : "Usuario actualizado", "success");
      setModal(null); load();
    } catch { showToast("Error al guardar usuario", "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Desactivar este usuario?")) return;
    try { await adminService.deleteUser(id); showToast("Usuario desactivado", "success"); load(); }
    catch { showToast("Error al eliminar", "error"); }
  };

  const toggleRoleId = (id) => setForm((f) => ({
    ...f, role_ids: f.role_ids.includes(id) ? f.role_ids.filter((r) => r !== id) : [...f.role_ids, id],
  }));

  const filtered = users.filter((u) =>
    `${u.name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="toolbar">
        <span className="toolbar-title">Usuarios</span>
        <input className="search-box" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary" onClick={openCreate}><IPlus /> Nuevo usuario</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr>
            <th>Estado</th><th>Nombre</th><th>Email</th><th>Roles</th><th>Acciones</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={5}><span className="spinner" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="empty">Sin usuarios</td></tr>
            ) : filtered.map((u) => (
              <tr key={u.id}>
                <td><span className={`status-dot ${u.is_active ? "dot-on" : "dot-off"}`} /></td>
                <td><strong>{u.name} {u.last_name}</strong></td>
                <td style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", color: "var(--text-muted)" }}>{u.email}</td>
                <td>
                  <div className="badge-wrap">
                    {u.roles?.map((r) => <span key={r.id} className="badge badge-role"><IShield size={11} />{r.name}</span>)}
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}><IEdit /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}><ITrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === "create" ? "Nuevo Usuario" : "Editar Usuario"} onClose={() => setModal(null)} icon={<IUser />}>
          <div className="form-group"><label>Nombre</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group"><label>Apellido</label>
            <input className="form-input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
          <div className="form-group"><label>Email</label>
            <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group"><label>Contraseña {modal === "edit" && "(dejar vacío para no cambiar)"}</label>
            <input className="form-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="form-group"><label>Roles</label>
            <div className="checkbox-grid">
              {roles.map((r) => (
                <label key={r.id} className={`checkbox-item ${form.role_ids.includes(r.id) ? "selected" : ""}`}>
                  <input type="checkbox" checked={form.role_ids.includes(r.id)} onChange={() => toggleRoleId(r.id)} />
                  <span>{r.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSubmit}><ICheck /> Guardar</button>
          </div>
        </Modal>
      )}
    </>
  );
};

// -> ROLES TAB
const RolesTab = ({ showToast }) => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", permission_ids: [] });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([adminService.getRoles(), adminService.getPermissions()]);
      setRoles(r); setPermissions(p);
    } catch { showToast("Error al cargar roles", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ name: "", permission_ids: [] }); setModal("create"); };
  const openEdit = (r) => {
    setSelected(r);
    setForm({ name: r.name, permission_ids: r.permissions?.map((p) => p.id) || [] });
    setModal("edit");
  };

  const handleSubmit = async () => {
    try {
      if (modal === "create") await adminService.createRole(form);
      else await adminService.updateRole(selected.id, form);
      showToast(modal === "create" ? "Rol creado" : "Rol actualizado", "success");
      setModal(null); load();
    } catch { showToast("Error al guardar rol", "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Desactivar este rol?")) return;
    try { await adminService.deleteRole(id); showToast("Rol desactivado", "success"); load(); }
    catch { showToast("Error al eliminar", "error"); }
  };

  const togglePerm = (id) => setForm((f) => ({
    ...f, permission_ids: f.permission_ids.includes(id)
      ? f.permission_ids.filter((p) => p !== id) : [...f.permission_ids, id],
  }));

  const filtered = roles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="toolbar">
        <span className="toolbar-title">Roles</span>
        <input className="search-box" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary" onClick={openCreate}><IPlus /> Nuevo rol</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Estado</th><th>Nombre</th><th>Permisos</th><th>Acciones</th></tr></thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={4}><span className="spinner" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="empty">Sin roles</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id}>
                <td><span className={`status-dot ${r.is_active ? "dot-on" : "dot-off"}`} /></td>
                <td><strong>{r.name}</strong></td>
                <td>
                  <div className="badge-wrap">
                    {r.permissions?.slice(0, 4).map((p) => <span key={p.id} className="badge badge-perm"><IKey size={10} />{p.key}</span>)}
                    {r.permissions?.length > 4 && <span className="badge badge-key">+{r.permissions.length - 4}</span>}
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}><IEdit /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}><ITrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === "create" ? "Nuevo Rol" : "Editar Rol"} onClose={() => setModal(null)} icon={<IRole />}>
          <div className="form-group"><label>Nombre del rol</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group"><label>Permisos</label>
            <div className="checkbox-grid">
              {permissions.map((p) => (
                <label key={p.id} className={`checkbox-item ${form.permission_ids.includes(p.id) ? "selected" : ""}`}>
                  <input type="checkbox" checked={form.permission_ids.includes(p.id)} onChange={() => togglePerm(p.id)} />
                  <span title={p.description}>{p.key}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSubmit}><ICheck /> Guardar</button>
          </div>
        </Modal>
      )}
    </>
  );
};

// -> PERMISSIONS TAB
const PermissionsTab = ({ showToast }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ key: "", description: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try { setPermissions(await adminService.getPermissions()); }
    catch { showToast("Error al cargar permisos", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ key: "", description: "" }); setModal("create"); };
  const openEdit = (p) => { setSelected(p); setForm({ key: p.key, description: p.description }); setModal("edit"); };

  const handleSubmit = async () => {
    try {
      if (modal === "create") await adminService.createPermission(form);
      else await adminService.updatePermission(selected.id, form);
      showToast(modal === "create" ? "Permiso creado" : "Permiso actualizado", "success");
      setModal(null); load();
    } catch { showToast("Error al guardar permiso", "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Desactivar este permiso?")) return;
    try { await adminService.deletePermission(id); showToast("Permiso desactivado", "success"); load(); }
    catch { showToast("Error al eliminar", "error"); }
  };

  const filtered = permissions.filter((p) =>
    `${p.key} ${p.description}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="toolbar">
        <span className="toolbar-title">Permisos</span>
        <input className="search-box" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary" onClick={openCreate}><IPlus /> Nuevo permiso</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Estado</th><th>Clave</th><th>Descripción</th><th>Acciones</th></tr></thead>
          <tbody>
            {loading ? (
              <tr className="loading-row"><td colSpan={4}><span className="spinner" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="empty">Sin permisos</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id}>
                <td><span className={`status-dot ${p.is_active ? "dot-on" : "dot-off"}`} /></td>
                <td><span className="badge badge-key">{p.key}</span></td>
                <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{p.description}</td>
                <td>
                  <div className="actions-cell">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><IEdit /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}><ITrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === "create" ? "Nuevo Permiso" : "Editar Permiso"} onClose={() => setModal(null)} icon={<IKey />}>
          <div className="form-group"><label>Clave (key)</label>
            <input className="form-input" placeholder="ej: products:create" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
          </div>
          <div className="form-group"><label>Descripción</label>
            <input className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSubmit}><ICheck /> Guardar</button>
          </div>
        </Modal>
      )}
    </>
  );
};

// -> ROOT
export const Admin = () => {
  const [tab, setTab] = useState("users");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const TABS = [
    { id: "users", label: "Usuarios", icon: <IUser /> },
    { id: "roles", label: "Roles", icon: <IRole /> },
    { id: "permissions", label: "Permisos", icon: <IKey /> },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="admin-root">
        <header className="admin-header">
          <div className="admin-header-logo"><IShield size={18} /></div>
          <h1>Panel de Administración</h1>
          <span>RBAC · Control de Acceso</span>
        </header>

        <nav className="admin-tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        <main className="admin-body">
          {tab === "users" && <UsersTab showToast={showToast} />}
          {tab === "roles" && <RolesTab showToast={showToast} />}
          {tab === "permissions" && <PermissionsTab showToast={showToast} />}
        </main>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
};

export default Admin;