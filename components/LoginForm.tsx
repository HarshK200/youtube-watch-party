import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <label className="block font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
          Email Address
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            <Mail />
          </span>
          <input
            className="w-full bg-surface-container-highest/50 border-none rounded-lg py-4 pl-12 pr-5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all duration-200 outline-none"
            placeholder="jane@cinema.social"
            type="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
          Password
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            <Lock />
          </span>
          <input
            className="w-full bg-surface-container-highest/50 border-none rounded-lg py-4 pl-12 pr-5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all duration-200 outline-none"
            placeholder="••••••••"
            type="password"
          />
        </div>
      </div>

      {/* NOTE: Login button */}
      <div className="pt-2">
        <button
          className="cursor-pointer w-full py-4 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed font-headline font-bold text-lg rounded-xl shadow-[0px_8px_24px_rgba(235,0,0,0.3)] active:scale-[0.98] transition-all duration-200 uppercase tracking-tight"
          type="submit"
        >
          Login
        </button>
      </div>

      <div className="pt-2">
        <button
          className="cursor-pointer w-full py-4 bg-white/5 backdrop-blur-md border border-white/10 text-on-surface font-headline font-bold text-lg rounded-xl hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(255,0,0,0.2)] active:scale-[0.98] transition-all duration-200 uppercase tracking-tight"
          type="button"
        >
          Login as Guest
        </button>
      </div>
    </form>
  );
}
