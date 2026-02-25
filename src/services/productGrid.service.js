import api from "./api.service";

export default class ProductGrid{

    //http://localhost:3014/api/productgrid

    // /getproductgrids
    async getAllProductGrids(){
        const response = await api.get("/productgrid/getproductgrids");
        return response.data;
    }

    // /getproductgrid/:id
    async getProductGridById(id){
        const response = await api.get(`/productgrid/getproductgrid/${id}`);
        return response.data;
    }    

    // /update/:id
    async updateProductGrid(id, data){
        const response = await api.put(`/productgrid/update/${id}`, data);
        return response.data;
    }


}