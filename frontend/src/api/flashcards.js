// src/api/flashcards.js
import axios from "axios";
import { getUserToken } from "../context/AccountsContext";

const BASE_URL = import.meta.env.VITE_API_URL || "https://myapp2-pzj8.onrender.com";

/** Generic Axios request helper */
async function request(method, endpoint, data = null, headers = {}) {
  const token = getUserToken();
  console.log(data, endpoint)
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

/** FLASHCARDS API **/
export const FlashcardsAPI = {
  /** Create a new flashcard set */
  createFlashcardSet: (data) => request("POST", "/flashcards/sets/", data),

  /** Get all flashcard sets for current user */
  getFlashcardSets: () => request("GET", "/flashcards/sets/"),

  /** Get a single flashcard set (with its flashcards) */
  getFlashcardSet: (id) => request("GET", `/flashcards/sets/${id}/`),

  /** Update a flashcard set */
  updateFlashcardSet: (id, data) => request("PUT", `/flashcards/sets/${id}/`, data),

  /** Delete a flashcard set */
  deleteFlashcardSet: (id) => request("DELETE", `/flashcards/sets/${id}/`),

  /** Create a new flashcard inside a set */
  createFlashcard: (setId, data) => request("POST", `/flashcards/sets/${setId}/flashcards/`, data),

  /** Update a specific flashcard */
  updateFlashcard: (id, data) => request("PUT", `/flashcards/flashcards/${id}/`, data),

  /** Delete a specific flashcard */
  deleteFlashcard: (id) => request("DELETE", `/flashcards/flashcards/${id}/`),
};
