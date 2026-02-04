import api from "./api.service";

export default class BrandService {
  constructor() {
    this.endpoint = "/brand/getbrands";
  }

  //http://localhost:3014/api/brand/getbrands/?page=1&limit=10
  async getAllBrands(page = 1, limit = 10) {
    try {
      const response = await api.get(`${this.endpoint}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error en getAllBrans - frontend: ", error.message);
      throw error;
    }
  }
}
