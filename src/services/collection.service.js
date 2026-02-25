import api from "./api.service";

export default class CollectionService {
  async createCollection(data) {
    const response = await api.post("/collection/createcollection", data);
    return response.data;
  }

  async getAllCollections() {
    const response = await api.get("/collection/collections");
    return response.data;
  }

  async getCollectionById(id) {
    const response = await api.get(`/collection/collection/${id}`);
    return response.data;
  }

  async getCollectionWithProducts(id) {
    const response = await api.get(`/collection/${id}/products`);
    return response.data;
  }

  async updateCollection(id, data) {
    const response = await api.put(`/collection/${id}`, data);
    return response.data;
  }

  async deleteCollection(id) {
    const response = await api.delete(`/collection/${id}`);
    return response.data;
  }

  async addProductToCollection(collectionId, productId) {
    const response = await api.post(`/collection/${collectionId}/products`, {
      product_id: productId,
    });
    return response.data;
  }

  async removeProductFromCollection(collectionId, productId) {
    const response = await api.delete(
      `/collection/${collectionId}/products/${productId}`
    );
    return response.data;
  }
}