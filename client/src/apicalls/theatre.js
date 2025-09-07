import { axiosInstance } from ".";

export const addTheatre = async (values) => {
  try {
    const response = await axiosInstance.post(
      "/api/theatre/add-theatre",
      values
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getAllTheatres = async () => {
  try {
    const response = await axiosInstance.get("api/theatre/get-all-theatres");
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getAllTheatresByOwner = async (ownerId) => {
  try {
    const response = await axiosInstance.get(
      `api/theatre/get-all-theatres/${ownerId}`
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const updateTheatre = async (theatreId, values) => {
  try {
    const response = await axiosInstance.put(
      `/api/theatre/update-theatre/${theatreId}`,
      values
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const deleteTheatre = async (theatreId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/theatre/delete-theatre/${theatreId}`
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
