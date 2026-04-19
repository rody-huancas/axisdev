import axios from "axios";

export interface Settings {
  language: string;
  widgets: { id: string; enabled: boolean }[];
  notifications?: { id: string; enabled: boolean }[];
}

export type SettingsUpdate = Partial<Settings>;

export const settingsApi = {
  get: async (): Promise<Settings> => {
    const response = await axios.get("/api/settings");
    return response.data.settings;
  },

  save: async (settings: SettingsUpdate): Promise<void> => {
    await axios.put("/api/settings", settings);
  },
};
