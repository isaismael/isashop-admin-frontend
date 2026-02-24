import api from "./api.service";

export default class CategoriesService {

  // -> crear un metodo de pago
  // /paymentmethod/createpaymentmethod
  async createPaymentMethod(data) {
    const response = await api.post("/paymentmethod/createpaymentmethod", data);
    return response.data;
  }

  // -> traer metodos de pago sin paginacion
  // /paymentmethod/allpaymentmethods
  async getAllPaymentMethods() {
    const response = await api.get("/paymentmethod/allpaymentmethods");
    return response.data;
  }

  // -> traer metodos de pago con paginacion
  // /paymentmethod/getpaymentmethods/
  async getPaymentMethods(page, limit) {
    const response = await api.get(`/paymentmethod/getpaymentmethods/?page=${page}&limit=${limit}`);
    return response.data;
  }


  // -> traer un metodo de pago por id
  // /paymentmethod/paymentbyid/:id
  async getPaymentMethodById(id) {
    const response = await api.get(`/paymentmethod/paymentbyid/${id}`);
    return response.data;
  }

  // -> actualizar un metodo de pago por id
  // /paymentmethod/updatepayment/:id
  async updatePaymentMethod(id, data) {
    const response = await api.put(`/paymentmethod/updatepayment/${id}`, data);
    return response.data;
  }

  // -> activar o desactivar un metodo de pago por id
  // /paymentmethod/disableapayment/:id
  async disablePayment(id) {
    const response = await api.put(`/paymentmethod/disableapayment/${id}`);
    return response.data;
  }


}
