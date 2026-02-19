import api from "./api.service";

export default class ProductImageService {
    constructor() {
        this.base = "/productimage";
    }

    // formData debe contener: image (File), product_id, product_variation_id, is_main (opcional)
    async createProductImage(formData) {
        try {
            const response = await api.post(`${this.base}/createproductImage`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            console.error("Error en createProductImage:", error.message);
            throw error;
        }
    }

    async getAllProductImages() {
        try {
            const response = await api.get(`${this.base}/getproductImages`);
            return response.data;
        } catch (error) {
            console.error("Error en getAllProductImages:", error.message);
            throw error;
        }
    }
}