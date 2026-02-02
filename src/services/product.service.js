import api from './api.service';

export default class ProductService{
    constructor(){
        this.endpoint = '/product/createproduct';
    }

    async createProduct(productData){
        try{
            const response = await api.post(this.endpoint, productData);
            return response.data;
        }catch(error){
            console.log(error.message);
            return null;
        }
    }

}