import api from "./api.service";

export default class BannerService {
  async getBanner() {
    const response = await api.get("/banner/getbanner");
    return response.data;
  }

  async updateBanner(id, data) {
    const response = await api.put(`/banner/updatebanner/${id}`, data);
    return response.data;
  }
}