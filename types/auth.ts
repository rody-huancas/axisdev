export type AppSession = {
  user?: {
    name ?: string | null;
    email?: string | null;
    image?: string | null;
  };
  accessToken?: string;
};
