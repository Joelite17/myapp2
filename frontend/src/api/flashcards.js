import axios from "axios";
import { getUserToken } from "../context/AccountsContext";
import { BASE_URL } from "./base_url";

const getAuthHeaders = () => {
  const token = getUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const FlashcardsAPI = {
    
  fetchFlashcardSets: async () => {
    const res = await axios.get(`${BASE_URL}/flashcardsets/`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  fetchFlashcardSet: async (id) => {
    const res = await axios.get(`${BASE_URL}/flashcardsets/${id}/`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  toggleLike: async (id) => {
    const res = await axios.post(
      `${BASE_URL}/flashcardsets/${id}/toggle_like/`,
      {},
      { headers: getAuthHeaders() }
    );
    return res.data;
  },
};
