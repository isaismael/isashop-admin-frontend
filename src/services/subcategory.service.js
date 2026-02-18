import api from "./api.service";

export default class SubcategoryService {
  constructor() {
    this.create = "/subcategory/createsubcategory";
    this.updateUrl = "/subcategory/updatesubcategory/";
  }

  async createSubcategory(subcategoryData) {
    try {
      const response = await api.post(this.create, subcategoryData);
      return response.data;
    } catch (error) {
      console.error("Error en createSubcategory - service: ", error.message);
      throw error;
    }
  }

  // -> http://localhost:3014/api/subcategory/updatesubcategory/1
  async updateSubcategory(id, subcategoryData) {
    try {
      const response = await api.put(`${this.updateUrl}${id}`, subcategoryData);
      return response.data;
    } catch (error) {
      console.error("Error en updateSubcategory: ", error.message);
      throw error;
    }
  }
}
