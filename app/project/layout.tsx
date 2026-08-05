"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/api";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔐</span>
          <span className="text-white font-semibold tracking-[-0.02em]">
            DevVault
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <a
            href="/dashboard"
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Projects
          </a>
          <a
            href="/audit"
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Audit Log
          </a>
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-red-400 text-sm transition-colors"
          >
            Sign out
          </button>
        </nav>
      </header>
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
