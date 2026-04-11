import axios from "axios";

export const googleApi = axios.create({
  baseURL: "https://www.googleapis.com",
  timeout: 12000,
});
