import api from "./api.service";

export default class PromoBannerService {

    //getpromobanner
    async getPromoBanner(){
        const response = await api.get("/promobanner/getpromobanner");
        return response.data;
    }

    //updatepromobanner /updatepromobanner/:id
    async updatePromoBanner(id, data){
        const response = await api.put(`/promobanner/updatepromobanner/${id}`, data);
        return response.data;
    }

}