"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

interface ISocketContext {
  joinRoom: () => void;

  socket?: Socket;
}
const SocketContext = React.createContext<ISocketContext | null>(null);
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error(`Socket context is undefined or null`);

  return context;
}

interface SocketProviderProps {
  children?: React.ReactNode;
}
export default function SocketProvider({ children }: SocketProviderProps) {
  const { id: partyId } = useParams<{ id: string }>();
  const router = useRouter();
  const session = useSession();
  const [socket, setSocket] = useState<Socket>();

  // NOTE: helper functions
  const joinRoom: ISocketContext["joinRoom"] = () => {};

  useEffect(() => {
    // NOTE: auth check
    if (session.status === "unauthenticated") {
      toast.error("You are not logged in");
      router.push("/login");
      return;
    }
    if (!partyId) {
      toast.error("Invalid partyId or session data");
      router.push("/");
      return;
    }
    if (!session.data) return;

    // NOTE: making websocket connection
    const _socket = io("http://localhost:8080", {
      auth: {
        userId: session.data.user.id,
        partyId: partyId,
      },
    });
    setSocket(_socket);

    // NOTE: socket cleanup on dismount
    return () => {
      _socket.disconnect();
      setSocket(undefined);
    };
  }, [partyId, session]);

  return (
    <SocketContext.Provider value={{ joinRoom, socket }}>
      {children}
    </SocketContext.Provider>
  );
}
