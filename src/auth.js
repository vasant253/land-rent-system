import { jwtDecode } from "jwt-decode";

const API_URL = "http://127.0.0.1:8000"; // Replace with your API base URL

export const getAccessToken = async () => {
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    console.log("No tokens found, user needs to log in.");
    return null;
  }

  try {
    const decodedToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

    if (decodedToken.exp < currentTime) {
      console.log("Access token expired, attempting to refresh...");
      const newAccessToken = await refreshAccessToken(refreshToken);
      return newAccessToken;
    }

    return accessToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token. User may need to log in again.");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.access);
    return data.access;
  } catch (error) {
    console.error("Token refresh error:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};
