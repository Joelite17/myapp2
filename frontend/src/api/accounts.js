import axios from "axios";
import { BASE_URL } from "./base_url";

const ACCOUNTS_URL = `${BASE_URL}/accounts`;

/** Create an Axios instance */
const api = axios.create({
  baseURL: ACCOUNTS_URL,
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
