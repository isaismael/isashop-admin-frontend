import api from "./api.service";

export default class BrandImageService {
  constructor() {
    this.endpoint_create = "/brandImage/createbrandImage";
    this.endpoint_update = "/brandImage/updatebrandImage/:id";
  }

  async createImageBrand({ brand_id, file, alt }) {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("brand_id", brand_id);
      if (alt) formData.append("alt", alt);

      const response = await api.post(this.endpoint_create, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async updateBrandImageById(id, { brand_id, file, alt }) {
    try {
      const formData = new FormData();
      if (file) formData.append("image", file);
      if (brand_id) formData.append("brand_id", brand_id);
      if (alt) formData.append("alt", alt);

      const response = await api.put(
        this.endpoint_update.replace(":id", id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
