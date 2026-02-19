import api from "./api.service";

export default class ProductImageService {
    constructor() {
        this.base = "/productimage";
        this.delete = "/productimage/deleteproductimage/"
        this.update = "/productimage/updateproductimage/"
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

    // -> /deleteproductimage/:id
    async deleteProductImage(id) {
        try {
            const response = await api.delete(`${this.delete}${id}`);
            return response.data;
        } catch (error) {
            console.error("Error en deleteProductImage:", error.message);
            throw error;
        }
    }


    // -> /productimage/updateproductimage/:id
    async updateProductImage(id, formData) {
        try {
            const response = await api.put(`${this.update}${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            console.error("Error en updateProductImage:", error.message);
            throw error;
        }
    }


}