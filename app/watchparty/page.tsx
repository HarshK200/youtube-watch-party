"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function WatchParty() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      toast.error("You are not logged in");
      router.push("/login");
    }
  }, [session]);

  return <>watch party page</>;
}
