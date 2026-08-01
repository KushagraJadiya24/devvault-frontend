"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, setToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        setToken(data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (e) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 border-r border-white/5 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-white/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-white/2 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10">
          <span className="text-white font-semibold text-lg tracking-[-0.02em]">
            DevVault
          </span>
        </div>

        {/* Center content */}
        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/50 text-xs tracking-widest uppercase">
                Secure by default
              </span>
            </div>
            <h2 className="text-white text-4xl font-semibold tracking-[-0.02em] leading-tight">
              Your team's secrets,
              <br />
              <span className="text-white/30">kept secret.</span>
            </h2>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs">
              AES-256 encrypted. Role protected. Audit logged. Built for
              developer teams who take security seriously.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {[
              "AES-256-GCM",
              "JWT Auth",
              "Redis Cache",
              "Audit Logs",
              "Versioning",
              ".env Import",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs text-white/40 bg-white/5 border border-white/8 rounded-md px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 gap-4 relative z-10">
          {[
            { value: "256-bit", label: "Encryption" },
            { value: "< 1ms", label: "Cache hits" },
            { value: "100%", label: "Audit coverage" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-white text-lg font-semibold tracking-tight">
                {stat.value}
              </div>
              <div className="text-white/30 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-xl">🔐</span>
            <span className="text-white font-semibold text-lg">DevVault</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-white text-2xl font-semibold tracking-[-0.01em]">
              Welcome back
            </h1>
            <p className="text-white/40 text-sm">
              Sign in to access your vault
            </p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/30 focus:ring-0 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/30 focus:ring-0 h-11"
              />
            </div>

            <Button
              className="w-full h-11 bg-white text-black hover:bg-white/90 font-medium"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-center text-white/30 text-sm">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-white/60 hover:text-white transition-colors"
              >
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
