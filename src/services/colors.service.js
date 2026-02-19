import api from "./api.service";

export default class ColorsService{
    constructor(){
        this.create = "/color/createcolor";
        this.getAll = "/color/getcolors/paginated/";
        this.updateUrl = "/color/updatecolor/";
    }

    async createColor(data){
        try {
            const response = await api.post(this.create, data);
            return response.data;
        } catch (error) {
            console.error("Error creating color:", error);
            throw error;
        }    
    }

async getColors(page, limit) {
    try {
        const response = await api.get(`${this.getAll}${page}/${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error getting colors:", error);
        throw error;
    }
}

    // -> /updatecolor/:id
    async updateColor(id, data){
        try {
            const response = await api.put(this.updateUrl + id, data);
            return response.data;
        } catch (error) {
            console.error("Error updating color:", error);
            throw error;
        }
    }


}