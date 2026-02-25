import api from "./api.service";

export default class CategoryBubblesService {
  // traer todas las CategoryBubbles
  async getAllCategoryBubbles() {
    const response = await api.get("/categorybubbles/getcategorybubbles");
    return response.data;
  }

  // update de CategoryBubbles
  async updateCategoryBubble(id, data) {
    const response = await api.put(
      `/categorybubbles/updatecategorybubbles/${id}`,
      data,
    );
    return response.data;
  }
}
