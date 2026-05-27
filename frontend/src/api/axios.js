import axios from "axios";

export const api = axios.create({
  baseURL:
  "https://location-tracker-dhe8.onrender.com/api",
});