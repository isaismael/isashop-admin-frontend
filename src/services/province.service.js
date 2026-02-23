import api from "./api.service";

export default class ProvinceService{

    // createProvince
    async createProvince(data){
        const response = await api.post("/province/createprovince", data);
        return response.data;
    }

    // getAllProvinces sin paginacion
    async getAllProvinces(){
        const response = await api.get("/province/getallprovinces");
        return response.data;
    }

    // getProvinces con paginacion
    async getProvinces(page, limit){
        const response = await api.get(`/province/getprovinces?page=${page}&limit=${limit}`);
        return response.data;
        }

    // getProvinceById /getprovincebyid/
    async getProvinceById(id){
        const response = await api.get(`/province/getprovincebyid/${id}`);
        return response.data;
    }

    // updateProvince /updateprovince/:id'
    async updateProvince(id, data){
        const response = await api.put(`/province/updateprovince/${id}`, data);
        return response.data;
    }    

}