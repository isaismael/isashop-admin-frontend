import api from './api.service';

export default class ProductService{
    constructor(){
        this.endpoint = '/product/createproduct';
        this.get_products = "/product/getproducts/"
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

    // -> http://localhost:3014/api/product/getproducts/:page/:limit
    async getProducts(page, limit){
        try {
            const response = await api.get(`${this.get_products}${page}/${limit}`);
            return response.data;
        } catch (error) {
            console.error("Error en getProducts - service: ", error.message);
            throw error;
        }
    }

}