import api from "./api.service";

export default class StockService{

    async createStock(data){
        const response = await api.post("/stock/createstock", data);
        return response.data;
    }

    async getAllStocks(){
        const response = await api.get("/stock/getallstocks");
        return response.data;
    }

    async getStocks(page, limit){
        const response = await api.get(`/stock/getstocks?page=${page}&limit=${limit}`);
        return response.data;
    }

    async getStockById(id){
        const response = await api.get(`/stock/getstockbyid/${id}`);
        return response.data;
    }

    async updateStock(id, data){
        const response = await api.put(`/stock/updatestock/${id}`, data);
        return response.data;
    }

}