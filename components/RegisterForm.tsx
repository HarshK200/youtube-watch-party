"use client";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleRegister(e: any) {
    e.preventDefault();

    // TODO: send this form data to /api/register route
    console.log(formData);

    try {
      const res = await axios.post("/api/register", formData);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
            First Name
          </label>
          <input
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full bg-surface-container-highest/50 border-none rounded-lg py-4 px-5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all duration-200 outline-none"
            placeholder="Jane"
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
            Last Name
          </label>
          <input
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full bg-surface-container-highest/50 border-none rounded-lg py-4 px-5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all duration-200 outline-none"
            placeholder="Doe"
            type="text"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">
          Email Address
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            <Mail />
          </span>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-surface-container-highest/50 border-none rounded-lg py-4 pl-12 pr-5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all duration-200 outline-none"
            placeholder="••••••••"
            type="password"
          />
        </div>
      </div>

      {/* NOTE: Register button*/}
      <div className="pt-4">
        <button
          onClick={handleRegister}
          className="cursor-pointer w-full py-4 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed font-headline font-bold text-lg rounded-xl shadow-[0px_8px_24px_rgba(235,0,0,0.3)] active:scale-[0.98] transition-all duration-200 uppercase tracking-tight"
          type="submit"
        >
          Register
        </button>
      </div>
    </form>
  );
}
