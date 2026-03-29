import SocketProvider from "@/context/SocketProvider";

export default function WatchPartyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SocketProvider>{children}</SocketProvider>
    </>
  );
}
