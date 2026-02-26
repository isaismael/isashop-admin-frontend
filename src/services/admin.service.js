import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const BASE = `${API}/admin`;

const api = axios.create({ baseURL: BASE });

// attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── USERS ───────────────────────────────────────────────────────────────────
export const getUsers = () => api.get("/users").then((r) => r.data.data);
export const getUserById = (id) => api.get(`/users/${id}`).then((r) => r.data.data);
export const createUser = (data) => api.post("/users", data).then((r) => r.data.data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data).then((r) => r.data.data);
export const deleteUser = (id) => api.delete(`/users/${id}`).then((r) => r.data);
export const assignRoleToUser = (userId, role_id) =>
  api.post(`/users/${userId}/roles`, { role_id }).then((r) => r.data);
export const removeRoleFromUser = (userId, roleId) =>
  api.delete(`/users/${userId}/roles/${roleId}`).then((r) => r.data);

// ─── ROLES ───────────────────────────────────────────────────────────────────
export const getRoles = () => api.get("/roles").then((r) => r.data.data);
export const getRoleById = (id) => api.get(`/roles/${id}`).then((r) => r.data.data);
export const createRole = (data) => api.post("/roles", data).then((r) => r.data.data);
export const updateRole = (id, data) => api.put(`/roles/${id}`, data).then((r) => r.data.data);
export const deleteRole = (id) => api.delete(`/roles/${id}`).then((r) => r.data);
export const assignPermissionToRole = (roleId, permission_id) =>
  api.post(`/roles/${roleId}/permissions`, { permission_id }).then((r) => r.data);
export const removePermissionFromRole = (roleId, permissionId) =>
  api.delete(`/roles/${roleId}/permissions/${permissionId}`).then((r) => r.data);

// ─── PERMISSIONS ─────────────────────────────────────────────────────────────
export const getPermissions = () => api.get("/permissions").then((r) => r.data.data);
export const getPermissionById = (id) => api.get(`/permissions/${id}`).then((r) => r.data.data);
export const createPermission = (data) => api.post("/permissions", data).then((r) => r.data.data);
export const updatePermission = (id, data) =>
  api.put(`/permissions/${id}`, data).then((r) => r.data.data);
export const deletePermission = (id) => api.delete(`/permissions/${id}`).then((r) => r.data);