// src/api/resources.js
import axios from "axios";
import { getUserToken } from "../context/AccountsContext";

const API_BASE = "http://localhost:8000"; // adjust to your backend

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = getUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// MCQ-related API calls
export const MCQAPI = {
  fetchMCQSets: async () => {
    try {
      const res = await axios.get(`${API_BASE}/mcqsets/`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (err) {
      console.error("Failed to fetch MCQ sets:", err);
      return [];
    }
  },

  fetchMCQSet: async (mcqSetId) => {
    try {
      const res = await axios.get(`${API_BASE}/mcqsets/${mcqSetId}/`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (err) {
      console.error(`Failed to fetch MCQ set ${mcqSetId}:`, err);
      return null;
    }
  },
};
export const ScoreAPI = {
  postScore: async (mcqSetId, score, total_score) => {
    try {
      const res = await axios.post(
        `${API_BASE}/mcqs/scores/`,
        { mcq_set: mcqSetId, score, total_score }, // send total obtainable score
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err) {
      console.error("Failed to post score:", err);
      throw err;
    }
  },

  fetchAllScores: async () => {
  try {
    const res = await axios.get(`${API_BASE}/mcqs/scores/`, {
      headers: getAuthHeaders(), // include auth token
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch scores:", err);
    throw err;
  }
},
};
