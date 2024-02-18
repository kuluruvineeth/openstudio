"use client";
import React, { useRef, useEffect } from "react";
import Plyr from "plyr";

const VideoPlayer = ({ src }: any) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const player = new Plyr(playerRef.current!, {
      controls: ["play", "progress", "fullscreen"],
    });

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  return (
    <video width={"400px"} height={"400px"} controls ref={playerRef}>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
