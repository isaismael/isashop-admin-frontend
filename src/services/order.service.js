import api from "./api.service";

export default class OrderService{

//router.post('/createorder', authenticateToken, authorizeRoles('IT'), OrderItemController.createOrderItem);
// -> sin paginacion
async getAllOrders(){
    const response = await api.get("/order/getallorders");
    return response.data;
}
//router.get('/getallorders', authenticateToken, authorizeRoles('IT'), OrderItemController.getAllOrderItems);
// -> con paginacion
//router.get('/getorders', authenticateToken, authorizeRoles('IT'), OrderItemController.getOrderItems);
async getOrders(page, limit){
    const response = await api.get(`/order/getorders?page=${page}&limit=${limit}`);
    return response.data;
}
// by id
//router.get('/orderitembyid/:id', authenticateToken, authorizeRoles('IT'), OrderItemController.getOrderItemById);
async getOrderById(id){
    const response = await api.get(`/order/getorderbyid/${id}`);
    return response.data;
}
// -> update
//router.put('/updateorderitem/:id', authenticateToken, authorizeRoles('IT'), OrderItemController.updateOrderItem);
async updateOrder(id, data){
    const response = await api.put(`/order/updateorder/${id}`, data);
    return response.data;
}

}