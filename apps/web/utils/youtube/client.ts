import { env } from "@/env.mjs";
import { google } from "googleapis";

type ClientOptions = {
  accessToken?: string;
  refreshToken?: string;
};

const getClient = (session: ClientOptions) => {
  const auth = new google.auth.OAuth2({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  });

  auth.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  return auth;
};

export const getYoutubeDataClient = (session: ClientOptions) => {
  const auth = getClient(session);
  const youtube = google.youtube({ version: "v3", auth });

  return youtube;
};

export const getYoutubeAnalyticsClient = (session: ClientOptions) => {
  const auth = getClient(session);
  const youtube = google.youtubeAnalytics({ version: "v2", auth });

  return youtube;
};
