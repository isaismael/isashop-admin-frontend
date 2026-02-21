import api from "./api.service";

export default class ProductService {
  constructor() {
    this.endpoint = "/product/createproduct";
    this.get_products = "/product/getproducts/";
    this.updateUrl = "/product/updateproduct/";
  }

  async createProduct(productData) {
    try {
      const response = await api.post(this.endpoint, productData);
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async getProducts(page, limit) {
    try {
      const response = await api.get(`/product/getproducts`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error en getProducts - service: ", error.message);
      throw error;
    }
  }

  // ->
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`${this.updateUrl}${id}`, productData);
      return response.data;
    } catch (error) {
      console.error("Error en updateProduct: ", error.message);
      throw error;
    }
  }
}
