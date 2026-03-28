"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { Role } from "@/app/generated/prisma/enums";
import { getYoutubeVideoIdFromUrl } from "@/lib/utils";
import { ClipLoader } from "react-spinners";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface PlayerProps {
  VideoUrl: string;
  Role: Role;
  playerRef: RefObject<any>;
}
export default function Player({ VideoUrl, Role, playerRef }: PlayerProps) {
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    const videoId = getYoutubeVideoIdFromUrl(VideoUrl);
    if (!videoId) return;

    // load script if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = createPlayer;

    function createPlayer() {
      playerRef.current = new window.YT.Player("player", {
        videoId: videoId,
        playerVars: {
          controls: 1, // hide default controls
          rel: 0,
          disablekb: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }

    function onPlayerReady() {
      setVideoLoading(false);
    }

    function onPlayerStateChange() {}
  }, [VideoUrl]);

  return (
    <div className="w-full h-full bg-black rounded-md overflow-hidden">
      <div className="relative h-full min-h-[400px]">
        {/* NOTE: ACTUAL PLAYER this div with id="player" will be replaced by youtube iframe api script */}
        <div className="w-full h-full min-h-[400px]" id="player"></div>

        {/* NOTE: loading states */}
        <ClipLoader
          loading={videoLoading}
          color="white"
          className="absolute top-1/2 -translate-Y-1/2 left-1/2 -translate-x-1/2"
        />
      </div>
    </div>
  );
}
