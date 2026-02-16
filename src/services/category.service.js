import api from "./api.service";

export default class CategoryService{
    constructor(){
        this.create = "/category/createcategory";
        this.getAll = "/category/getallcategories";
    }

    async createCategory(categoryData){
        try {
            const response = await api.post(this.create, categoryData);
            return response.data;
        } catch (error) {
            console.error("Error en createCategory - service: ", error.message);
            throw error;
        }
    }

    async getallCategories(){
        try {
            const response = await api.get(this.getAll);
            return response.data;
        } catch (error) {
            console.error("Error en getallCategories - services: ", error.message);
            throw error;
        }
    }

}