import { PartySessionMember } from "@/context/SocketProvider";
import { Star, User } from "lucide-react";

export default function PartyMemberCard({
  member,
}: {
  member: PartySessionMember;
}) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer active:opacity-80">
      <div className="relative">
        <div
          className={`w-10 h-10 rounded-full ${member.role === "HOST" ? "border-primary border-2" : "border"} ${member.role === "MODERATOR" && "border-tertiary"} flex items-center justify-center`}
        >
          <User />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-[#131313] flex items-center justify-center">
          {member.role === "HOST" && <Star width={8} className="text-black" />}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-on-surface">
          {member.firstname} {member.lastname}
        </p>
        {member.role !== "VIEWER" && (
          <p
            className={`text-[10px] ${member.role === "HOST" && "text-primary"} ${member.role === "MODERATOR" && "text-tertiary"} uppercase font-black`}
          >
            {member.role}
          </p>
        )}
      </div>
    </div>
  );
}
