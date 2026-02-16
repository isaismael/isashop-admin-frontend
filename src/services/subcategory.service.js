import api from "./api.service";

export default class SubcategoryService{
    constructor(){
        this.create = "/subcategory/createsubcategory";
    }

    async createSubcategory(subcategoryData){
        try {
            const response = await api.post(this.create, subcategoryData);
            return response.data;
        } catch (error) {
            console.error("Error en createSubcategory - service: ", error.message);
            throw error;
        }
    }

}