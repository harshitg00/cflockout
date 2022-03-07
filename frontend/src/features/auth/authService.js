import axios from "axios";
import { AUTH_API_URL, USER_TOKEN_KEY } from "../../config/constants";

// Register user.
const register = async (userData) => {
  const response = await axios.post(`${AUTH_API_URL}/register`, userData);
  if (response.data) {
    localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(response.data));
  }
  return response.data;
};

// Login user.
const login = async (userData) => {
  const response = await axios.post(`${AUTH_API_URL}/login`, userData);
  if (response.data) {
    localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem(USER_TOKEN_KEY);
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
