import api from './api.service';

export default class ProductVariationService{
    constructor(){
        this.create_variation = "/productvariation/createproductvariation"
    }

    // -> http://localhost:3014/api/productvariation/createproductvariation
    async createProductVariation(variationData){
        try {
            const response = await api.post(this.create_variation, variationData);
            return response.data;
        } catch (error) {
            console.error("Error en createProductVariation - service: ", error.message);
            return null;
        }
    }

}