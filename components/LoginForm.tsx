"use client";
import { Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}
export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [responseErr, setResponseErr] = useState<string | null>(null);
  const router = useRouter();
  const callbackUrl = "/";

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLogin(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: callbackUrl,
      });

      if (res?.ok) {
        setResponseErr(null);
        router.push(callbackUrl);
      } else {
        setResponseErr("Invalid email or password");
      }
    } catch (err) {
      alert("Error loging in check console");
      console.log("Error during login:", err);
    }
  }

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
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* NOTE: Login button */}
      <div className="pt-2">
        <button
          className="cursor-pointer w-full py-4 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed font-headline font-bold text-lg rounded-xl shadow-[0px_8px_24px_rgba(235,0,0,0.3)] active:scale-[0.98] transition-all duration-200 uppercase tracking-tight"
          type="submit"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </form>
  );
}
