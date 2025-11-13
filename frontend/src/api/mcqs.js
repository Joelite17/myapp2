// src/api/mcqs.js
import axios from "axios";
import { getUserToken } from "../context/AccountsContext";
import { BASE_URL } from "./base_url";

const getAuthHeaders = () => {
  const token = getUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const MCQAPI = {
  fetchMCQSets: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/mcqsets/`, {
        headers: getAuthHeaders(),
      });
      console.log(res.data)
      return res.data;
    } catch (err) {
      console.error("Failed to fetch MCQ sets:", err);
      return [];
    }
  },

  fetchMCQSet: async (mcqSetId) => {
    try {
      const res = await axios.get(`${BASE_URL}/mcqsets/${mcqSetId}/`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (err) {
      console.error(`Failed to fetch MCQ set ${mcqSetId}:`, err);
      return null;
    }
  },

  toggleLike: async (mcqSetId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/mcqsets/${mcqSetId}/toggle_like/`,
        {},
        { headers: getAuthHeaders() }
      );
      return res.data; // expected: { liked: true/false, likes_count: number }
    } catch (err) {
      console.error(`Failed to toggle like for MCQSet ${mcqSetId}:`, err);
      throw err;
    }
  },
};

export const ScoreAPI = {
  postScore: async (mcqSetId, score, total_score) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/mcqs/scores/`,
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
    const res = await axios.get(`${BASE_URL}/mcqs/scores/`, {
      headers: getAuthHeaders(), // include auth token
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch scores:", err);
    throw err;
  }
},
};
