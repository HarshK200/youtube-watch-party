"use client";
import axios from "axios";
import { CirclePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function HeroSection() {
  const session = useSession();
  const router = useRouter();
  const [partyCode, setPartyCode] = useState("");

  async function handleCreateWatchParty() {
    // NOTE: validate if user is logged in, if not push to login page
    if (session.status !== "authenticated") {
      toast.error("Please login to create a watchparty");
      router.push("/login");
      return;
    }

    // NOTE: creates a watchparty entry in db by sending request to /api/watchparty/create
    try {
      const res = await axios.post("/api/watchparty/create", {});
      console.log(res);

      const { watchPartyId } = res.data;

      // NOTE: finally redirect to watchparty/${slug}
      toast("Redirecting to watchparty", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      router.push(`/watchparty/${watchPartyId}`);
    } catch (err) {
      console.log("Error: ", err);
    }
  }

  async function handleJoinParty() {
    // validate if user is logged in, if not push to login page
    if (session.status !== "authenticated") {
      toast.error("Please login to create a watchparty");
      router.push("/login");
      return;
    }

    //  creates a WatchPartyMember entry in db by sending request to /api/watchparty/join
    try {
      const res = await axios.post("/api/watchparty/join", {
        partyId: partyCode,
      });
      console.log(res);

      const { watchPartyId, message } = res.data;

      // NOTE: finally redirect to watchparty/${slug}
      toast("Joined party successfully, Redirecting to watchparty", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      router.push(`/watchparty/${watchPartyId}`);
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  }

  return (
    <section className="relative w-full pt-12 pb-20 px-6 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* NOTE: Grid Col 1 Action buttons */}
        <div className="z-10">
          {/* NOTE: Hero text */}
          <span className="inline-block bg-primary-container/20 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 font-label">
            Live Social Streaming
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter leading-none mb-8">
            SYNC YOUR <span className="text-primary italic">VIBE.</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-body">
            Experience movies, gaming clips, and live events with friends as if
            you're in the same neon-lit theater. No lag, just pure connection.
          </p>

          {/* NOTE: Create New WatchParty section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              className="cursor-pointer pulse-gradient text-on-primary-fixed px-8 py-4 rounded-xl font-headline font-extrabold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              onClick={handleCreateWatchParty}
            >
              <CirclePlus />
              Create Watch Party
            </button>
          </div>

          {/* NOTE: Join WatchParty section */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 shadow-2xl max-w-md">
            <h3 className="text-sm font-label font-bold uppercase tracking-wider text-on-surface-variant mb-4">
              Join an existing Party
            </h3>
            <div className="flex gap-2">
              <input
                className="grow bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none"
                placeholder="Paste party code..."
                value={partyCode}
                onChange={(e) => setPartyCode(e.target.value)}
                type="text"
              />
              <button
                className="cursor-pointer bg-surface-bright hover:bg-surface-container-highest text-primary font-bold px-6 py-3 rounded-lg transition-colors active:scale-95"
                onClick={handleJoinParty}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* NOTE: Grid Col 2 Asymmetric Bento-style Visuals */}

        <div className="relative grid grid-cols-6 grid-rows-6 gap-4 h-[500px] lg:h-[600px]">
          <div className="col-span-4 row-span-4 rounded-xl overflow-hidden shadow-2xl relative group">
            <img
              className="w-full h-full object-cover"
              data-alt="Cinematic movie scene on a large screen"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBevuPELj_9DpAI5G7Xw6ZbHlqr0vmxjWeSxf_bLnEEae7I0DenxPDyALutUNb8EoMzegOsNvswKfAG51PHaiolISW-jyB1JvDvlrrGuv5Nyw9HbbU6oXgCZ3dwCXvKOODjhb6uY1jUKTw_ybSnzoOf_M9cH5oIVJqAHLNhOIpsmjTSVpwbhpbcT0rpyHHzy26h23OJCMhaugdfievTSBGwaRZd19aRvUS0sVdiaEcddMx-IaqhGLXNd-YD4pw-1gbH2ypNH8BF5Cg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-4 left-4 glass-panel px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold font-label uppercase">
                1.2k Watching
              </span>
            </div>
          </div>
          <div className="col-span-2 row-span-3 bg-surface-container-high rounded-xl overflow-hidden relative group">
            <img
              className="w-full h-full object-cover opacity-80"
              data-alt="Pro gaming setup with neon lights"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWg5p1HzH2MrgOiuqA5k1lsb-J3buet0s31JkZgBliixqrDY1ik38NpLOykQg3dUfbB0n-YNb9Bls609bdu8FGSc33KXNAlryofSvv_VL3bx8SdgrL6P7LwiejbqNobXhMGca7eKGeNyIp_yulNsyUwWt9Pfw8-mEl0Lo3Lu0CGoXwn79bOyFiwBs1tOpvs4qqYaRmxu5Ts01t-PoZ2K9FdXRxx5YrMwEmbhuNOWPwzPmfMXnzOfokD0cpV2mOjvji3bFnC7UfthU"
            />
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="col-span-2 row-span-3 rounded-xl overflow-hidden relative">
            <img
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
              data-alt="Retro technology aesthetic"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCte4sV-qF-8BwpmCbeCmPtPyZkBnrOMqL-JL19__ATnV3-LNO2bSf9xA38RpldIq2hQoAT4dWLghnAhC5z1wKXUHSEo0rm3ESrLqfrTgsbs8F2LAjEM73GKuhaZXpBI0gL_kuuz0-UTjhXRyYFayNVUxmmOBmdXlLnFHNuOYVPinCv7jK_s8XmPSzm3pvBMgtK8sL_Cm3ISF-fvVupoXXn7-OQ6ZRWokUGzTQ56RQBirLW0Jeu0doT1JQocSIa2Slj4nGh0xg5WQ0"
            />
          </div>
          <div className="col-span-4 row-span-2 bg-surface-container-low rounded-xl flex items-center justify-center p-8 border border-primary/20">
            <div className="text-center">
              <div className="flex -space-x-3 justify-center mb-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  data-alt="User profile avatar 1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTDfTZEtBAX6TQA6s1CATefe4eGJYRfKrP3ajuFPvT8eama0acMC-qeuf-o4txON23zORwHezFBt4bLBxGK3ZU9ituJk9r4u4f4TnGew9s9CJqQRp3ugiPEtAhKueOW2-pmOPmqlRREPtP9c0LmL8Bp0LfLB9XNwrXXb9RB2xusdyMgTjsAYnl_xgvglqxzcME6weS1qReKMfkw1PciMZUFEy4aSz_hu-zaJOiNEfziowa0hzJVd8gyaeaULOgONZlgPgS1lT7C-w"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  data-alt="User profile avatar 2"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJii-KOj4c6WGKEjHDPx6d40i4aZJLh8XwTFbcilOxNYMe8cFiM84mHD6KUUJWMzskUPlcbff-Y4zqaiiqXbF-jCxdmVp3960Bdk1DU_OAGUMTlqXoZlMywi6p2EIlP05KNCs9Oge6SEAos4UWbTbU_ja0LshpgApA6-lWr0t7GTOgX7rJhT9gtAPGCvkS_bzI_vFebl7opSVXbZcxdm1zGIUjBR9_WAkd-SKdEwyhsOltiYnSqLjP_oUMo1ZTU5LHGFV1Qlq6e04"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  data-alt="User profile avatar 3"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2FDm3qGDvWt__Z_Rlk_C1adVgVhoGk3vPRiWAuuIxwGamj3CY1-JknllH7DgRv96YB8m77xmQlCfdB2EjxCVki5kuoJrXPy-xtktEC6r9PkideKpfvknYhl3PMVwoPImrRiqJwRFKLT_ep-cA6JHN-LZm7XZUiXo6bboxBfa-5mSuDMuGncVLBimG8J1FwkjnHMdM6YJYYiJCOhFu9aYZkrTJA68TjDtHezasRNgpBtpRTMo3dV0d0Advcb_1N4CHpF-Io9R8IF0"
                />
                <div className="w-10 h-10 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">
                  +24
                </div>
              </div>
              <p className="text-xs font-label uppercase tracking-widest text-primary">
                Your friends are online
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
