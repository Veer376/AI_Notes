import axios from 'axios';
import Cookies from 'js-cookie'

// Base Axios instance
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, // Adjust based on your backend URL
  withCredentials: true, // Include credentials (cookies, etc.)
});

// Function to get user profile
export const getProfile = async () => {
  try {
    const response = await API.get('/auth/getProfile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Function to log in
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await API.post('/auth/login', {"email": email, "password": password});
    // localStorage.setItem('token', response.data.token); // Store token
    console.log(response);
    Cookies.set('token', response.data.token, { expires: 7}); // Store token in cookie
    return response.data;
    
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Function to register a new user
export const registerUser = async (email: string, password: string) => {
  try {
    const response = await API.post('/auth/register', {"email": email, "password": password});
    
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Function to log out
export const logoutUser = async () => {
  localStorage.removeItem('token');
};
