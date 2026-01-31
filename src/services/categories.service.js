import api from "./api.service";

export default class CategoriesService {
  constructor() {
    this.endpoint = "/subcategory/getsubcategories";
  }
  async getAllCategories() {
    try {
      const response = await api.get(this.endpoint);
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
