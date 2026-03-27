"use client";
import RegisterForm from "@/components/RegisterForm";
import { ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const session = useSession();
  const router = useRouter();
  if (session.status === "authenticated") {
    router.push("/");
  }

  return (
    <main className="bg-background cinematic-bg text-on-surface font-body selection:bg-primary selection:text-on-primary-container min-h-screen">
      {/* NOTE: background gradient */}
      <div className="fixed inset-0 grain-texture"></div>

      <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-12">
        {/* NOTE: wrapper div Registration Canvas */}

        <main className="relative z-10 w-full max-w-lg">
          {/* NOTE: Branding Header */}
          <div className="text-center mb-10">
            <h1 className="font-headline text-4xl font-black tracking-tighter text-primary-dim uppercase mb-2">
              Yt_watchparty
            </h1>
            <p className="text-on-surface-variant font-label text-sm uppercase tracking-[0.2em]">
              Join a watch party
            </p>
          </div>

          {/* NOTE: Form Container */}
          <div className="glass-panel rounded-xl p-8 md:p-10 shadow-[0px_24px_48px_rgba(0,0,0,0.8)] border border-white/5">
            <RegisterForm />

            {/* NOTE: Social Proof / Footer */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-on-surface-variant text-sm mb-4">
                Already have an account?
                <Link
                  className="text-primary font-bold hover:underline ml-1 transition-all"
                  href="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* NOTE: Contextual Note */}
          <div className="mt-8 flex items-center justify-center space-x-3 text-on-surface-variant/40">
            <span className="material-symbols-outlined text-sm">
              <ShieldCheck />
            </span>
            <span className="text-[10px] uppercase tracking-[0.1em] font-label">
              End-to-end encrypted watchparty experience
            </span>
          </div>
        </main>
      </div>
    </main>
  );
}
