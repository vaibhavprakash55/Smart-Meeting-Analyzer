import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const uploadAudio = async (formData) => {
  return await API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};