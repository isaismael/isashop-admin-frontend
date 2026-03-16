import api from "./api.service";

export default class CustomerService{

    // -> http://localhost:3014/api/customer/getcustomers/:page/:limit
    async getCustomers(page, limit){
        const response = await api.get(`/customer/getcustomers/${page}/${limit}`);
        return response.data;
    }

}