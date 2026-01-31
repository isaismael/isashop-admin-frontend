import api from "./api.service";

export default class BrandService {
  constructor() {
    this.endpoint = "/brand/getbrands";
  }

  async getAllBrands() {
    try {
      const response = await api.get(this.endpoint);
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
