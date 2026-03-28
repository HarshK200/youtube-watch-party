"use client";
import Player from "@/components/Player";
import { getYoutubeVideoIdFromUrl } from "@/lib/utils";
import { Clapperboard, Edit, Share2, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function WatchParty() {
  const playerRef = useRef<any>(null);
  const [currentVideoMetadata, setCurrentVideoMetadata] = useState<any>(null);
  const { id: partyId } = useParams<{ id: string }>();
  const session = useSession();
  const router = useRouter();
  const [youtubeUrl, setYoutubeUrl] = useState(
    "https://www.youtube.com/watch?v=vx5vpG6jEXI",
  );

  useEffect(() => {
    if (session.status === "unauthenticated") {
      toast.error("You are not logged in");
      router.push("/login");
    }

    // NOTE: getting partyId from url
    if (!partyId || !session.data) return;
    console.log("PartyId: ", partyId);
    console.log(session.data.user);

    // TODO:
    // STEP 1: send request to /api/watchparty/partyId
    // STEP 2: It will validate if watchparty exists and if user is in it? and return UserRole i.e. VIEWER | HOST
    // STEP 3: Now connect to the websocket server using socket.io and in payload send the userRole *This is very insecure ONLY FOR MVP*
  }, [partyId, session]);

  return (
    <main className="flex-1 flex overflow-hidden">
      <section className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
        {/* NOTE: Youtube video player */}
        <Player
          VideoUrl={youtubeUrl}
          Role="HOST"
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
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </div>
          <button
            className="pulse-gradient text-on-primary-fixed px-6 py-2.5 rounded-lg font-headline font-bold text-sm active:scale-95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap flex items-center gap-2 cursor-pointer"
            onClick={() => {
              const newVideoId = getYoutubeVideoIdFromUrl(youtubeUrl);
              if (!newVideoId) {
                toast.error("Invalid youtube link. Please enter a valid link");
                return;
              }
              playerRef.current.cueVideoById(newVideoId);
            }}
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
                    Hosted By: {session.data?.user.firstname}{" "}
                    {session.data?.user.lastname}
                  </span>
                </p>
              </div>
            </div>

            <p className="text-on-surface-variant text-sm leading-relaxed">
              TODO: add watchparty description button
            </p>
          </div>

          <button className="flex cursor-pointer w-fit h-fit items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-sm font-medium transition-all active:scale-95">
            <Share2 />
            Share
          </button>
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
                  128 Watching Now
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

              <div className="flex items-center gap-3 group cursor-pointer active:opacity-80">
                <div className="relative">
                  <img
                    alt="Alex"
                    className="w-10 h-10 rounded-full border-2 border-primary"
                    data-alt="Portrait of Alex, the room host"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0b5RWpyVlktSk3i0oxfXajo_CiZ13K1_1S683yH2s9xKJGCtSiRf-DnZnCtRUzez46oBwd6ZVbvAd_681TgudfyZO2P05VhjT4V6d6S4tXLFuT1OOKgK0UxyvFQeAIA3Kd_7iLPyEuAxMfLBQvbN9o8CewjoFrmmP3_JyfBdajk-P9BP8Ziyj5JXVqOFXZHFT38ZRJVt7QNS2ATn6qxz6SaTwTVLVcMPWgIMRqzubc-JqG4mCtV0MSZclC5oGGbduJZLJf0BI004"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-[#131313] flex items-center justify-center">
                    <Star width={8} className="text-black" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Alex</p>
                  <p className="text-[10px] text-primary uppercase font-black">
                    Admin
                  </p>
                </div>
              </div>
            </div>

            {/* NOTE: Moderators list */}
            <div>
              <h3 className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-4 font-bold">
                Moderators
              </h3>
              <div className="flex items-center gap-3 group cursor-pointer active:opacity-80">
                <div className="relative">
                  <img
                    alt="Sarah"
                    className="w-10 h-10 rounded-full border border-tertiary"
                    data-alt="Portrait of Sarah, the moderator"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8lfi3iQCfBoVC6wlpqW-SKtKquMh0kzRo8Q-OEKKy3tiOuFKPcyhVfrhLHYMR5fr15NC311Hi2-dB0ON40X-XXj1coiJi8OQhkg4ib0XIjg4vcjvaR5QO6AMmyeji5BLkWXW8kYRK__QYBI9oGZ7w8cn69e0vhfz2dVidtqOb_DD0C1n0GKoyFE-aInwO89IwYx_J-SS-Ml8bh2hjX-t1BYK453pOvqgg2iBQTTO_TEizv91Ik_6blcKgXDGgg9Iql3u7WlWZRc0"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary rounded-full border-2 border-[#131313]"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Sarah</p>
                  <p className="text-[10px] text-tertiary uppercase font-black">
                    Moderator
                  </p>
                </div>
              </div>
            </div>

            {/* NOTE: Viewers list */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">
                  Viewers (12)
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 group cursor-pointer active:opacity-80">
                  <img
                    alt="User"
                    className="w-10 h-10 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                    data-alt="Male user profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB64bdChtWQP6ysoJabdhUCVwZVq-wNm1nL0Ri6U6mU8wte9aBvYgETQEovD2j8enI2bMG5z2E3GOyKUdGX24ssUtRyXZMnuTLB7-j01S3W8gU6IrfnR5DpFDfHhoGbaQDc7MkLu05cS9H78FCmvmNY45_apDeIPoJkH8bKDi97qU4RHW3DnqTnWvmkWj9ddYJBvIooO2067p2yBIYiQ1DFe_pLiOqPTUbbBQJDsRlP4GA7wzVjB85kWvAAQFWt3LVMJr4RRQioWiM"
                  />
                  <p className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface">
                    David M.
                  </p>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer active:opacity-80">
                  <img
                    alt="User"
                    className="w-10 h-10 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                    data-alt="Female user profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4-XHyFIrsVOIujyrz3Delt1YQzyTEm8eaUumsUnkmWf2rFJun6q9TVZf2ePOd2rhZaq1bSw53w4YaTDoglt_Yr9LQkMQ1fib0Gt0TGyREi0na-pvh1l4UeUDdDXkdXP5Bn9n0ojtZkea3PPmV71oB8hZmuW-DcMy2PJyQSCtpVVzXbTj5rK6qORzxqfsZlVBLgQl2pNgQGIVlw4JxTJehfdwIiljZnSm1yW6DPNN2gjJbn727lEr3dKJFvMQf0DkezAl1PJgW_kY"
                  />
                  <p className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface">
                    Elena Rose
                  </p>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer active:opacity-80">
                  <img
                    alt="User"
                    className="w-10 h-10 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                    data-alt="Professional male user profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqpnz0TGp_CdAD7dqSPD3l4ixcGPy6F2lf82uciGjVmztweTNzuA6Mzv6K92CjnRqsz4TuAFX26_NPxy_ypwzxh9NhtwYDX0YCPRFoyPIAT1kOepRDogSx5bLmyTSiiddD5rHVrllNr4YrL66FVJa06CSODIeCHJw7EHFiU74-2DbsztyRZDY1xtWZ2a_CvHDO4NlW1GDbGQDsMq9a100dq5V5HxNSXjrMZpWAIyA0lknkAyLNyiHAqbHbHSamxcw2Gf4V5qY9Kr0"
                  />
                  <p className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface">
                    Marcus T.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 bg-[#0e0e0e]/50 border-t border-white/5 space-y-3">
          <button
            className="w-full py-3 bg-surface-container-high border border-white/10 text-on-surface font-black uppercase tracking-widest text-xs rounded-lg transition-all active:scale-95 hover:bg-surface-bright"
            onClick={() => alert("Work in progress")}
          >
            Invite Friends
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
