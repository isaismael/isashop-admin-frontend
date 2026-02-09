import api from "./api.service";

export default class BrandService {
  constructor() {
    this.endpoint = "/brand/getbrands";
    this.endpoint_create = '/brand/createbrand'
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

  async createBrand(brandData){
    try{
      const response = await api.post(this.endpoint_create, brandData);
      return response.data;
    }catch(error){
      console.log("Error en createBrand - frontend: ",error.message);
      return null;
    }
  }

}
