// src/api/accounts.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/accounts";

/** Create an Axios instance */
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // include cookies for session auth
});

/** Generic request helper */
async function request(endpoint, method = "GET", data = null, headers = {}) {
  try {
    const res = await api.request({
      url: endpoint,
      method,
      data,
      headers,
    });
    return res.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(
        err.response.data.detail ||
          err.response.data.message ||
          JSON.stringify(err.response.data)
      );
    }
    throw new Error(err.message);
  }
}

/** ACCOUNTS API FUNCTIONS **/
export const AccountsAPI = {
  /** Register a new user */
  register: (formData) => request("/register/", "POST", formData),

  /** Log user in with username or email */
  login: (identifier, password) =>
    request("/login/", "POST", { identifier, password }),

  /** Request password reset link */
  forgotPassword: (email) =>
    request("/password-reset/", "POST", { email }),

  /** Confirm password reset */
  resetPassword: (uid, token, passwords) =>
    request(`/password-reset-confirm/${uid}/${token}/`, "POST", passwords),
};
