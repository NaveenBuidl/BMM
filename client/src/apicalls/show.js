import { axiosInstance } from ".";

export const addShow = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/show/add-show", payload);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const updateShow = async (showId, payload) => {
  try {
    const response = await axiosInstance.put(`/api/show/update-show/${showId}`, payload);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const deleteShow = async (showId) => {
  try {
    const response = await axiosInstance.delete(`/api/show/delete-show/${showId}`);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const getAllTheatresByMovie = async (movieId, date) => {
  try {
    const response = await axiosInstance.get(
      `/api/show/get-all-theatres-by-movie/${movieId}/${date}`
    );
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const getShowsByTheatre = async (theatreId) => {
  try {
    const response = await axiosInstance.get(
      `/api/show/get-all-shows-by-theatre/${theatreId}`
    );
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const getShowById = async (showId) => {
  try {
    const response = await axiosInstance.get(`/api/show/get-show/${showId}`);
    return response.data;
  } catch (err) {
    return err.message;
  }
};
