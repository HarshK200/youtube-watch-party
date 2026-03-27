"use client";
import { CircleArrowRight, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const session = useSession();

  return (
    <header className="bg-[#0e0e0e] docked full-width top-0 z-50 shadow-[0px_24px_48px_rgba(0,0,0,0.5)]">
      <nav className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
        <Link
          className="cursor-pointer text-2xl font-black tracking-tighter text-[#eb0000] uppercase font-['Plus_Jakarta_Sans']"
          href={"/"}
        >
          YT_WatchParty
        </Link>
        <div className="hidden md:flex items-center space-x-8 font-['Plus_Jakarta_Sans'] font-bold tracking-tight">
          <Link
            className="text-[#ff8e7d] border-b-2 border-[#ff8e7d] pb-1"
            href={"/"}
          >
            Home
          </Link>
          <Link
            className="text-[#adaaaa] hover:text-[#ff8e7d] transition-colors"
            href={"/"}
          >
            Friends
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-on-surface-variant">
            {session.status === "authenticated" ? (
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full transition-all duration-200">
                  <User />
                </button>
                <span>
                  {session.data.user.firstname} {session.data.user.lastname}
                </span>
                <button
                  className="flex gap-2 cursor-pointer mx-4 px-4 py-2 bg-[#ff8e7d] hover:bg-[#eb0000] hover:text-white font-bold text-black rounded-xl transition-all duration-200"
                  name="logout"
                  onClick={() => signOut()}
                >
                  Logout
                  <CircleArrowRight />
                </button>
              </div>
            ) : (
              <button
                className="p-2 px-4 font-bold text-[#ff8e7d] cursor-pointer hover:bg-[#201f1f] rounded-full transition-all duration-200"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
