import api from "./api.service";

export default class CategoryService{
    constructor(){
        this.create = "/category/createcategory";
        this.getAll = "/category/getallcategories";
        this.updatecategory = "/category/updatecategory/";
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

    // -> http://localhost:3014/api/category/updatecategory/1
    async updateCategory(id, categoryData){
        try {
            const response = await api.put(`${this.updatecategory}${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error("Error en updateCategory - service: ", error.message);
            throw error;
        }
    }

}