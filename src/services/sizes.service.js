import api from "./api.service";

export default class SizesService {
  constructor() {
    this.createUrl = "/size/createsize";
    this.getAllUrl = "/size/getsizes";
    this.paginatedUrl = "/size/getsizes/pagination/";
    this.updateUrl = "/size/updatesize/";
  }

  async createSize(data) {
    const response = await api.post(this.createUrl, data);
    return response.data;
  }

  async getSizes() {
    const response = await api.get(this.getAllUrl);
    return response.data;
  }

  async getSizesPaginated(page, limit) {
    const response = await api.get(`${this.paginatedUrl}${page}/${limit}`);
    return response.data;
  }

  async updateSize(id, data) {
    const response = await api.put(this.updateUrl + id, data);
    return response.data;
  }
}
