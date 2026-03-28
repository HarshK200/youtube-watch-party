"use client";
import React from "react";

interface ISocketContext {
  joinRoom: () => void;
  sendMessage: (msg: string) => any;
}
const SocketContext = React.createContext<ISocketContext | null>(null);

interface SocketProviderProps {
  children?: React.ReactNode;
}
export default function SocketProvider({ children }: SocketProviderProps) {
  return (
    <SocketContext.Provider value={null}>{children}</SocketContext.Provider>
  );
}
