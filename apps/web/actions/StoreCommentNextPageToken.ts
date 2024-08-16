"use server";

import { supabaseServerClient } from "@/supabase/supabaseServer";

export const storeCommentNextPageToken = async (
  channelId: string,
  nextPageToken: string | null,
  noMoreComments?: boolean,
) => {
  const supabase = await supabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("NO USER", user);
    return null;
  }

  if (nextPageToken) {
    // Update or insert the next page token if it exists
    const { error } = await supabase.from("channel_comment_pagination").upsert({
      channel_id: channelId,
      next_page_token: nextPageToken,
    });

    if (error) {
      console.log("Error storing channel comment next page token", error);
    }
  } else {
    // Update or insert the next page token if it exists
    const { error } = await supabase.from("channel_comment_pagination").upsert({
      channel_id: channelId,
      next_page_token: nextPageToken,
      no_more_comments: noMoreComments,
    });

    if (error) {
      console.log("Error updating channel comment next page token", error);
    }
  }
};
