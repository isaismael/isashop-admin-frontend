import api from './api.service';

export default class ProductVariationService {
  constructor() {
    this.base = "/productvariation";
    this.updateUrl = "/productvariation/updateproductvaration/"
  }

  async createProductVariation(variationData) {
    try {
      const response = await api.post(`${this.base}/createproductvariation`, variationData);
      return response.data;
    } catch (error) {
      console.error("Error en createProductVariation:", error.message);
      throw error;
    }
  }

  async getAllProductVariations() {
    try {
      const response = await api.get(`${this.base}/getproductvariations`);
      return response.data;
    } catch (error) {
      console.error("Error en getAllProductVariations:", error.message);
      throw error;
    }
  }
  // -> notita porque no le entendí bien, equis de
  // Trae las variantes filtradas por product_id
  // Requiere que el backend tenga: GET /productvariation/getproductvariations?product_id=X
  // O una ruta dedicada: GET /productvariation/byproduct/:productId
  async getVariationsByProduct(productId) {
    try {
      const response = await api.get(`${this.base}/getproductvariations?product_id=${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error en getVariationsByProduct:", error.message);
      throw error;
    }
  }

  //-> update de la variante
  async updateProductVariation(id, variationData){
    try {
        const response = await api.put(`${this.updateUrl}${id}`, variationData);
        return response.data;
    } catch (error) {
        console.error("Error en updateProductVariation: ", error.message);
        throw error;
    }
  }
}