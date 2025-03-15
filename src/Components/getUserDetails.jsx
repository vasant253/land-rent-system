import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const getUserDetails = async () => {
  let accessToken = localStorage.getItem("accessToken");
  let refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    console.error("No tokens found. Please log in again.");
    return null;
  }

  try {
    const response = await axios.get(`${API_URL}/user/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        // 🔄 Refresh the Token
        const refreshResponse = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });

        accessToken = refreshResponse.data.access;
        localStorage.setItem("accessToken", accessToken);

        // 🔄 Retry the request with new token
        const retryResponse = await axios.get(`${API_URL}/user/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        return retryResponse.data;
      } catch (refreshError) {
        console.error("Token refresh failed. Please log in again.");
        localStorage.clear();
        return null;
      }
    } else {
      console.error("Error fetching user data:", error);
      return null;
    }
  }
};
