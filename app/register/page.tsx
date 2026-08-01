"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, setToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await registerUser(email, password);
      if (data.token) {
        setToken(data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Registration failed");
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
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/2 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 relative z-10">
          <span className="text-white font-semibold text-lg tracking-[-0.02em]">
            DevVault
          </span>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/50 text-xs tracking-widest uppercase">
                Free to get started
              </span>
            </div>
            <h2 className="text-white text-4xl font-semibold tracking-[-0.02em] leading-tight">
              One vault
              <br />
              <span className="text-white/30">for your whole team.</span>
            </h2>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs">
              Create an account and start storing secrets securely in under 2
              minutes.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: "✦", text: "Invite teammates as MEMBER or ADMIN" },
              {
                icon: "✦",
                text: "Organize secrets by project and environment",
              },
              { icon: "✦", text: "Import your existing .env files instantly" },
              {
                icon: "✦",
                text: "Every access is logged with full audit trail",
              },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-white/20 text-xs mt-0.5">
                  {item.icon}
                </span>
                <span className="text-white/40 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

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
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-xl">🔐</span>
            <span className="text-white font-semibold text-lg">DevVault</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-white text-2xl font-semibold tracking-[-0.01em]">
              Create your account
            </h1>
            <p className="text-white/40 text-sm">
              Start managing secrets securely
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
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/30 focus:ring-0 h-11"
              />
            </div>

            <Button
              className="w-full h-11 bg-white text-black hover:bg-white/90 font-medium"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </Button>

            <p className="text-center text-white/30 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-white/60 hover:text-white transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
