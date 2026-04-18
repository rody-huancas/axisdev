import axios from "axios";
import type { GmailMensaje } from "@/services/google-service";

export type GmailMessageFull = GmailMensaje & {
  fecha       ?: string;
  destinatario?: string;
  htmlContent ?: string;
};

export const gmailApi = {
  getMessages: async (): Promise<GmailMensaje[]> => {
    const response = await axios.get("/api/gmail/messages");
    return response.data.items;
  },

  getMessageById: async (id: string): Promise<GmailMessageFull> => {
    const response = await axios.get(`/api/gmail/messages/${id}`);
    return response.data.item;
  },

  sendReply: async (messageId: string, text: string): Promise<void> => {
    await axios.post(`/api/gmail/messages/${messageId}/reply`, { text });
  },
};
