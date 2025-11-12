// src/api/mcqs.js
import axios from "axios";
import { getUserToken } from "../context/AccountsContext";

const BASE_URL = import.meta.env.VITE_API_URL || "https://myapp2-pzj8.onrender.com";

async function request(method, endpoint, data = null, headers = {}) {
  const token = getUserToken();
  try {
    const res = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...headers,
      },
    });
    return res.data;
  } catch (err) {
    console.error("API Error:", err.response || err.message);
    throw new Error(
      err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Unknown error"
    );
  }
}

export const MCQAPI = {
  createMCQSet: (data) => request("POST", "/mcqs/", data),
  getMCQSets: () => request("GET", "/mcqs/"),
  getMCQSet: (id) => request("GET", `/mcqs/${id}/`),
  updateMCQSet: (id, data) => request("PUT", `/mcqs/${id}/`, data),
  deleteMCQSet: (id) => request("DELETE", `/mcqs/${id}/`),
};
