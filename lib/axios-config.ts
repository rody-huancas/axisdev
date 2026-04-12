import axios from "axios";
import { env } from "@/lib/env";

export const googleApi = axios.create({
  baseURL: env.api.google,
  timeout: 12000,
});
