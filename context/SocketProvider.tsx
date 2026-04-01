"use client";
import { Role } from "@/app/generated/prisma/enums";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

export interface PartySessionMember {
  userId: string;
  role: Role;
  socketId: string;
  firstname: string;
  lastname: string;
}
export interface PartyState {
  videoLink: string;
  members: PartySessionMember[];
  hostId: string;
}
type SocketResponse<T = any> = {
  ok: boolean;
  status?: number;
  message?: string;
  data?: T;
};

interface ISocketContext {
  emitPlay: (time: number) => Promise<void>;
  emitPause: (time: number) => Promise<void>;
  emitChangeVideo: (videoId: string) => Promise<void>;

  partyState: PartyState | undefined;
  setPartyState: React.Dispatch<React.SetStateAction<PartyState | undefined>>;
  socket: React.RefObject<Socket | null>;
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
  const socket = useRef<Socket>(null);
  const [partyState, setPartyState] = useState<PartyState>();

  useEffect(() => {
    console.log(socket);
  }, [socket]);

  const emitPlay: ISocketContext["emitPlay"] = useCallback(
    (time) => {
      console.log("Emitting play", socket);
      return new Promise<void>((resolve, reject) => {
        socket.current?.emit("play", { time }, (res: SocketResponse) => {
          if (!res.ok) {
            reject(res.message);
          } else {
            resolve();
          }
        });
      });
    },
    [socket],
  );

  const emitPause: ISocketContext["emitPause"] = useCallback(
    (time) => {
      return new Promise<void>((resolve, reject) => {
        socket.current?.emit("pause", { time }, (res: SocketResponse) => {
          if (!res.ok) {
            reject(res.message);
          } else {
            resolve();
          }
        });
      });
    },
    [socket],
  );

  const emitChangeVideo: ISocketContext["emitChangeVideo"] = useCallback(
    (videoLink) => {
      return new Promise<void>((resolve, reject) => {
        socket.current?.emit(
          "change_video",
          { videoLink },
          (res: SocketResponse) => {
            if (!res.ok) {
              reject(res.message);
            } else {
              resolve();
            }
          },
        );
      });
    },
    [socket],
  );

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
    socket.current = io("http://localhost:8080", {
      auth: {
        userId: session.data.user.id,
        partyId: partyId,
      },
    });

    socket.current?.on("connect", () => {
      toast.success("socket connected");
    });

    socket.current?.on("disconnect", () => {
      toast.error("socket disconnected");
    });

    // NOTE: bind socket error handler
    socket.current?.on(
      "connection_error",
      (data: { status: number; message: string }) => {
        console.error(
          `Error occured during websocket connection \n${JSON.stringify(data)}`,
        );

        switch (data.status) {
          case 404:
            // watchParty doesn't exist
            toast.error(data.message);
            router.push("/");
            return;

          case 403:
            // user not member of watchParty or Invalid user
            toast.error(data.message);
            router.push("/");
            return;
        }
      },
    );

    // NOTE: bind socket state sync handler
    socket.current?.on("party_state", (data) => {
      console.log("Party state: ", data);
      setPartyState(data);
    });

    // NOTE: socket cleanup on dismount
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [partyId, session]);

  return (
    <SocketContext.Provider
      value={{
        emitChangeVideo,
        emitPlay,
        emitPause,
        socket,
        partyState,
        setPartyState,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
