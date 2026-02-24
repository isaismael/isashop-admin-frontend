import api from "./api.service";

export default class PickupAddress {
  async createPickupAddress(data) {
    const response = await api.post("/pickupaddress/createpickupaddress", data);
    return response.data;
  }

  async getAllPickupAddresses() {
    const response = await api.get("/pickupaddress/getallpickupaddresses");
    return response.data;
  }

  async getPickupAddresses(page, limit) {
    const response = await api.get(
      `/pickupaddress/getpickupaddresses?page=${page}&limit=${limit}`,
    );
    return response.data;
  }

  async getPickupAddressById(id) {
    const response = await api.get(`/pickupaddress/pickupaddressesbyid/${id}`);
    return response.data;
  }

  async updatePickupAddress(id, data) {
    const response = await api.put(
      `/pickupaddress/updatepickupaddresses/${id}`,
      data,
    );
    return response.data;
  }
}
