"use client";

import React from "react";
import { useWindowSize } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { YouTubeVideo } from "./YoutubeVideo";
export function OnboardingModalDialog({
  isModalOpen,
  setIsModalOpen,
  title,
  description,
  videoId,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  videoId: string;
}) {
  const { width } = useWindowSize();

  const videoWidth = Math.min(width * 0.75, 1200);
  const videoHeight = videoWidth * (675 / 1200);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="min-w-[350px] sm:min-w-[600px] md:min-w-[750px] lg:min-w-[880px] xl:min-w-[1280px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <YouTubeVideo
          videoId={videoId}
          iframeClassName="mx-auto"
          opts={{
            height: `${videoHeight}`,
            width: `${videoWidth}`,
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 1,
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
