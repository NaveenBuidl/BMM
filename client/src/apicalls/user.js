import { axiosInstance } from ".";

// Register
export const RegisterUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/register", payload);
    return response.data;
  } catch (err) {
    return err;
  }
};

// Login
export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response.data;
  } catch (err) {
    return err;
  }
};

// Forgot password
export const ForgetPassword = async (value) => {
  try {
    const response = await axiosInstance.patch(
      "/api/users/forgetpassword",
      value
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// Reste password
export const ResetPassword = async (value) => {
  try {
    const response = await axiosInstance.patch(
      "/api/users/resetpassword",
      value
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// Get Current User Details
export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/current-user");
    return response.data;
  } catch (err) {
    return err;
  }
};
