"use client";

import { RefObject, useEffect, useState } from "react";
import { getYoutubeVideoIdFromUrl } from "@/lib/utils";
import { ClipLoader } from "react-spinners";
import { TriangleAlert } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface PlayerProps {
  VideoUrl: string;
  playerRef: RefObject<any>;
  setCurrentVideoMetadata: React.SetStateAction<any>;
}
export default function Player({
  VideoUrl,
  playerRef,
  setCurrentVideoMetadata,
}: PlayerProps) {
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
          controls: 1,
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

      const videoMetadata = playerRef.current.getVideoData();
      setCurrentVideoMetadata(videoMetadata);
    }

    function onPlayerStateChange(event: any) {
      // NOTE: on video change
      if (
        event.data === window.YT.PlayerState.CUED ||
        event.data === window.YT.PlayerState.PLAYING
      ) {
        const data = event.target.getVideoData();
        setCurrentVideoMetadata(data);
      }
    }
  }, [VideoUrl]);

  return (
    <div className="w-full h-full bg-black rounded-md overflow-hidden">
      <div className="relative h-full min-h-[400px]">
        {/* NOTE: ACTUAL PLAYER this div with id="player" will be replaced by youtube iframe api script */}
        <div className="w-full h-full min-h-[400px]" id="player"></div>

        {/* NOTE: loading states */}
        {VideoUrl === "" && !playerRef.current ? (
          <div className="absolute top-1/2 -translate-Y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <TriangleAlert className="size-20" />
            <span>Invalid Video link</span>
          </div>
        ) : (
          <ClipLoader
            loading={videoLoading}
            className="absolute text-white top-1/2 -translate-Y-1/2 left-1/2 -translate-x-1/2"
          />
        )}
      </div>
    </div>
  );
}
