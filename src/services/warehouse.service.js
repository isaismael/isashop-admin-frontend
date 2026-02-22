import api from "./api.service";

export default class WarehouseService {
  async createWarehouse(data) {
    try {
      const response = await api.post("/warehouse/createwarehouse", data);
      return response.data;
    } catch (error) {
      console.error("Error en createWarehouse - service: ", error.message);
      throw error;
    }
  }

  //-> get all warehouse sin paginacion, es mas que nada para ver el listado de los activos
  async getAllWarehouse() {
    try {
      const response = await api.get("/warehouse/getallwarehouses");
      return response.data;
    } catch (error) {
      console.error("Error en getAllWarehouse - service: ", error.message);
      throw error;
    }
  }

  //-> este tiene paginacion /warehouse/getwarehouses
  async getWarehouses(page, limit) {
    try {
      const response = await api.get(
        `/warehouse/getwarehouses?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error en getWarehouses - service: ", error.message);
      throw error;
    }
  }

  // -> by id /warehouse/getwarehousebyid/

  async getWarehouseById(id) {
    try {
      const response = await api.get(`/warehouse/getwarehousebyid/?id=${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en getWarehouseById - service: ", error.message);
      throw error;
    }
  }

  // -> update
  async updateWarehouse(id, data) {
    const response = await api.put(
      `/warehouse/updatewarehouse/?id=${id}`,
      data,
    );
    return response.data;
  }
}
