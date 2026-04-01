"use client";

import { RefObject, useEffect, useState } from "react";
import { getYoutubeVideoIdFromUrl } from "@/lib/utils";
import { ClipLoader } from "react-spinners";
import { TriangleAlert } from "lucide-react";
import { useSocket } from "@/context/SocketProvider";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

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
  const { emitPlay, emitPause, partyState } = useSocket();
  const session = useSession();
  const role = partyState?.members.find(
    (m) => m.userId === session.data?.user.id,
  )?.role;

  // NOTE: state change emitters
  function handlePlayerStateChange(event: any) {
    if (role !== "HOST") {
      return;
    }

    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        emitPlay(playerRef.current?.getCurrentTime()).catch((e) =>
          toast.error(e),
        );
        break;

      case window.YT.PlayerState.PAUSED:
        emitPause(playerRef.current?.getCurrentTime()).catch((e) =>
          toast.error(e),
        );
        break;
    }
  }

  useEffect(() => {
    if (playerRef.current) return;

    const videoId = getYoutubeVideoIdFromUrl(VideoUrl);
    if (!videoId) return;
    if (!session.data) return;
    const userId = session.data.user.id;
    if (!partyState) return;
    const role = partyState.members.find((m) => m.userId === userId)?.role;

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
          controls: role === "HOST" ? 1 : 0,
          rel: 0,
          disablekb: 1,
        },
        events: {
          onReady: handlePlayerReady,
          onStateChange: handlePlayerStateChange,
        },
      });
    }

    function handlePlayerReady() {
      setVideoLoading(false);

      const videoMetadata = playerRef.current.getVideoData();
      setCurrentVideoMetadata(videoMetadata);
    }
  }, [VideoUrl, session, partyState]);

  return (
    <div className="w-full h-full bg-black rounded-md overflow-hidden">
      <div className="relative h-full min-h-[400px]">
        {/* NOTE: ACTUAL PLAYER this div with id="player" will be replaced by youtube iframe api script */}
        <div className="w-full h-full min-h-[400px]" id="player"></div>
        {/* NOTE: loading states */}
        {VideoUrl === "" && (
          <div className="absolute top-1/2 -translate-Y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <TriangleAlert className="size-20" />
            <span>Invalid Video link</span>
          </div>
        )}
        {!playerRef.current && VideoUrl !== "" && (
          <ClipLoader
            loading={videoLoading}
            color="white"
            size={60}
            className="absolute top-1/2 -translate-Y-1/2 left-1/2 -translate-x-1/2"
          />
        )}
      </div>
    </div>
  );
}
