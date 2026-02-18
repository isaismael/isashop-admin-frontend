import api from "./api.service";

export default class DepartmentsService {
  constructor() {
    this.create = "/department/createdepartment";
    this.getAll = "/department/getalldepartments";
    this.getdepartment = "/department/getdepartments";
    this.updatedepartment = "/department/updatedepartment/";
  }

  async createDepartment(departmentData) {
    try {
      const response = await api.post(this.create, departmentData);
      return response.data;
    } catch (error) {
      console.error("Error en createDepartment - service: ", error.message);
      throw error;
    }
  }

  async getAllDepartments() {
    try {
      const response = await api.get(this.getAll);
      return response.data;
    } catch (error) {
      console.error("Error en getAllDepartments - services: ", error.message);
      throw error;
    }
  }

  // -> http://localhost:3014/api/department/getdepartments/?page=1&limit=10
  async getCategoryTree(page = 1, limit = 10) {
    try {
      const response = await api.get(this.getdepartment, {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error en getDepartments - service: ", error.message);
      throw error;
    }
  }

  // -> http://localhost:3014/api/department/updatedepartment/1
  async updateDepartment(id, departmentData){
    try {
      const response = await api.put(`${this.updatedepartment}${id}`, departmentData);
      return response.data;
    } catch (error) {
      console.error("Error en updateDepartment - service: ", error.message);
      throw error;
    }
  }

}
