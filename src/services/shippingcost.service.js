import api from "./api.service";

export default class ShippingCostService{

    async createShippingCost(data){
        const response = await api.post("/shippingcost/createshippingcost", data);
        return response.data;
    }

    // getAllShippingCosts sin paginacion
    async getAllShippingCosts(){
        const response = await api.get("/shippingcost/getallshippingcost");
        return response.data;
    }

    // getShippingCosts con paginacion
    async getShippingCosts(page, limit){
        const response = await api.get(`/shippingcost/getshippingcost?page=${page}&limit=${limit}`);
        return response.data;
    }

    // getShippingCostById /shippingcostbyid/:id
    async getShippingCostById(id){
        const response = await api.get(`/shippingcost/shippingcostbyid/${id}`);
        return response.data;
    }

    // updateShippingCost /updateshippingcost/:id
    async updateShippingCost(id, data){
        const response = await api.put(`/shippingcost/updateshippingcost/${id}`, data);
        return response.data;
    }
    

}