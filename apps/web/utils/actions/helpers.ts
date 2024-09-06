import { auth } from "../auth";
import { getYoutubeDataClient } from "../youtube/client";

export const isStatusOk = (status: number) => status >= 200 && status < 300;

export async function getSessionAndYoutubeClient() {
  const session = await auth();
  if (!session?.ownerEmail) return { error: "Not logged in" };
  const youtube = getYoutubeDataClient(session);
  return { youtube, user: { id: session.userId, email: session.ownerEmail } };
}

export function handleError(error: unknown, message: string) {
  console.error(message, error);
  return { error: message };
}
