import axios from "axios";

export interface Settings {
  language: string;
  widgets: { id: string; enabled: boolean }[];
  notifications: { id: string; enabled: boolean }[];
}

export const settingsApi = {
  get: async (): Promise<Settings> => {
    const response = await axios.get("/api/settings");
    return response.data.settings;
  },

  save: async (settings: Settings): Promise<void> => {
    await axios.put("/api/settings", settings);
  },
};