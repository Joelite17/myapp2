// src/api/notes.js
import axios from "axios";
import { getUserToken } from "../context/AccountsContext";

const BASE_URL = import.meta.env.VITE_API_URL || "https://myapp2-pzj8.onrender.com";

/** Generic Axios request helper */
async function request(method, endpoint, data = null, headers = {}) {
  const token = getUserToken(); // get token from localStorage
  console.log(token)
  try {
    const res = await axios({
      method,
      url: `${BASE_URL}${endpoint}`, // endpoint should start with '/'
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "", // or `Token ${token}` if using DRF TokenAuth
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

/** NOTES API FUNCTIONS **/
export const NotesAPI = {
  /** Create a new note */
  createNote: (data) => request("POST", "/notes/", data),

  /** Get all notes */
  getNotes: () => request("GET", "/notes/"),

  /** Get a single note by ID */
  getNote: (id) => request("GET", `/notes/${id}/`),

  /** Update a note by ID */
  updateNote: (id, data) => request("PUT", `/notes/${id}/`, data),

  /** Delete a note by ID */
  deleteNote: (id) => request("DELETE", `/notes/${id}/`),
};
