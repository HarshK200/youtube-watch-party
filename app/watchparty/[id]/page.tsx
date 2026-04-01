"use client";
import PartyMemberCard from "@/components/PartyMemberCard";
import Player from "@/components/Player";
import { useSocket } from "@/context/SocketProvider";
import { getYoutubeVideoIdFromUrl } from "@/lib/utils";
import { Clapperboard, Edit } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function WatchParty() {
  const { socket, emitChangeVideo, partyState, setPartyState } = useSocket();

  const playerRef = useRef<any>(null);
  const [currentVideoMetadata, setCurrentVideoMetadata] = useState<any>(null);
  const [youtubeUrl, setYoutubeUrl] = useState(partyState?.videoLink ?? "");
  const [urlInputValue, setUrlInputValue] = useState("");
  const { id: partyId } = useParams();

  useEffect(() => {
    if (partyState) setYoutubeUrl(partyState.videoLink);
  }, [partyState]);

  // NOTE: socket events handlers
  useEffect(() => {
    if (!socket.current) return;

    socket.current?.on("play", ({ time }) => {
      console.log(`play event by server with time ${time}`);

      playerRef.current?.seekTo(time, true);
      playerRef.current?.playVideo();
    });

    socket.current?.on("pause", ({ time }) => {
      console.log(`pause event by server with time ${time}`);

      playerRef.current?.seekTo(time, true);
      playerRef.current?.pauseVideo();
    });

    socket.current?.on("change_video", ({ videoLink }) => {
      setPartyState((prev) => {
        if (prev) return { ...prev, videoLink: videoLink };
      });

      setYoutubeUrl(videoLink);
      const videoId = getYoutubeVideoIdFromUrl(videoLink);
      if (!videoId) {
        toast.error("Invalid video id was set by the host");
        playerRef.current?.cueVideoById("");
        return;
      }
      playerRef.current?.cueVideoById(videoId);
    });

    return () => {
      socket.current?.off("play");
      socket.current?.off("change_video");
    };
  }, [socket.current]);

  async function handleChangeVideoUrl(e: React.MouseEvent<HTMLButtonElement>) {
    // NOTE: emmit event "request:change_video" to ws-server *ws-server has db access if user role is HOST then change video and ws-server emmits "change_video" else return an error*
    try {
      await emitChangeVideo(urlInputValue);

      setYoutubeUrl(urlInputValue);

      // NOTE: now cue the new video
      const newVideoId = getYoutubeVideoIdFromUrl(urlInputValue);
      if (!newVideoId) {
        toast.error("No youtube link. Please enter a valid link");
        return;
      }
      playerRef.current?.cueVideoById(newVideoId);
    } catch (err: any) {
      console.error(err);
      toast.error(err);
    }
  }

  async function handleInvite() {
    try {
      if (partyId) {
        navigator.clipboard.writeText(partyId as string);
      }
      toast("Invite code copied to clipboard");
    } catch (err) {
      console.error(`Failed to write to clipboard: ${err}`);
    }
  }

  return (
    <main className="flex-1 flex overflow-hidden">
      <section className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
        {/* NOTE: Youtube video player */}
        <Player
          VideoUrl={youtubeUrl}
          playerRef={playerRef}
          setCurrentVideoMetadata={setCurrentVideoMetadata}
        />

        {/* NOTE: change video link bar */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center gap-4 shadow-xl">
          <div className="flex-1 flex items-center gap-3 bg-surface-container-lowest/50 px-4 py-2.5 rounded-lg border border-white/10 group focus-within:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">
              link
            </span>
            <input
              className="bg-transparent border-none p-0 w-full text-sm text-on-surface-variant focus:ring-0 select-all font-medium outline-none cursor-pointer"
              type="text"
              value={urlInputValue}
              onChange={(e) => setUrlInputValue(e.target.value)}
            />
          </div>
          <button
            className="pulse-gradient text-on-primary-fixed px-6 py-2.5 rounded-lg font-headline font-bold text-sm active:scale-95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap flex items-center gap-2 cursor-pointer"
            onClick={handleChangeVideoUrl}
          >
            <Edit />
            Change Video
          </button>
        </div>

        {/* NOTE: Host details section */}
        <div className="flex gap-4">
          <div className="md:col-span-2 glass-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-bold text-lg">
                  {currentVideoMetadata?.title}
                </p>
                <p className="text-sm text-on-surface-variant">
                  <span className="font-bold text-primary">
                    Hosted By:{" "}
                    {
                      partyState?.members.find(
                        (member) => member.role === "HOST",
                      )?.firstname
                    }{" "}
                    {
                      partyState?.members.find(
                        (member) => member.role === "HOST",
                      )?.lastname
                    }
                  </span>
                </p>
              </div>
            </div>

            <p className="text-on-surface-variant text-sm leading-relaxed">
              TODO: add watchparty description button
            </p>
          </div>
        </div>
      </section>

      {/* NOTE: Right Sidebar: list of people watching */}
      <aside className="w-80 flex flex-col bg-[#131313] border-l border-white/5 hidden lg:block">
        <div className="p-6 space-y-6">
          {/* NOTE: no of people watching count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/10">
                <Clapperboard />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">
                  {partyState && partyState.members.length} Watching Now
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* NOTE: Hosts list*/}
            <div>
              <h3 className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-4 font-bold">
                Host
              </h3>

              {partyState &&
                partyState.members
                  .filter((member) => member.role === "HOST")
                  .map((m) => <PartyMemberCard member={m} key={m.userId} />)}
            </div>

            {/* NOTE: Moderators list */}
            <div>
              <h3 className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-4 font-bold">
                Moderators
              </h3>
              {partyState &&
                partyState.members
                  .filter((member) => member.role === "MODERATOR")
                  .map((m) => <PartyMemberCard member={m} key={m.userId} />)}
            </div>

            {/* NOTE: Viewers list */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">
                  Viewers (
                  {partyState &&
                    partyState.members.filter(
                      (member) => member.role === "VIEWER",
                    ).length}
                  )
                </h3>
              </div>

              {partyState &&
                partyState.members
                  .filter((member) => member.role === "VIEWER")
                  .map((m) => <PartyMemberCard member={m} key={m.userId} />)}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 bg-[#0e0e0e]/50 border-t border-white/5 space-y-3">
          <button
            className="w-full py-3 bg-surface-container-high border border-white/10 text-on-surface font-black uppercase tracking-widest text-xs rounded-lg transition-all active:scale-95 hover:bg-surface-bright cursor-pointer"
            onClick={handleInvite}
          >
            Invite
          </button>
          <button
            className="w-full py-3 bg-linear-to-br from-primary-dim to-error-container text-white font-black uppercase tracking-widest text-xs rounded-lg shadow-xl shadow-error-container/20 transition-all active:scale-95"
            onClick={() =>
              alert(
                "TODO: close websocket connection and then remove entries from watchpartyMember and watchparty table",
              )
            }
          >
            Leave Room
          </button>
        </div>
      </aside>
    </main>
  );
}
