"use client";

import { useEffect, useState } from "react";
import {
  getAllowedEmails,
  addAllowedEmail,
  removeAllowedEmail,
  getToken,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AllowedEmail {
  id: number;
  email: string;
  addedAt: string;
}

export default function TeamPage() {
  const [emails, setEmails] = useState<AllowedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchEmails = async () => {
    const token = getToken();
    if (!token) return;
    const data = await getAllowedEmails(token);
    setEmails(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleAdd = async () => {
    const token = getToken();
    if (!token || !newEmail.trim()) return;
    setAdding(true);
    setError("");
    const result = await addAllowedEmail(token, newEmail);
    if (result) {
      setNewEmail("");
      fetchEmails();
    } else {
      setError("Failed to add email. It may already be allowed.");
    }
    setAdding(false);
  };

  const handleRemove = async (id: number) => {
    const token = getToken();
    if (!token) return;
    await removeAllowedEmail(token, id);
    fetchEmails();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-white text-2xl font-semibold tracking-[-0.02em]">
          Team Access
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Control who can register and join your vault
        </p>
      </div>

      {/* Add email */}
      <div className="border border-white/8 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-medium text-sm">Invite teammate</h2>
        <p className="text-white/30 text-xs">
          Add their email below. They can then register at your DevVault URL.
        </p>
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <Input
            type="email"
            placeholder="teammate@company.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10 flex-1"
          />
          <Button
            onClick={handleAdd}
            disabled={adding}
            className="bg-white text-black hover:bg-white/90 h-10"
          >
            {adding ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>

      {/* Allowed emails list */}
      <div className="space-y-3">
        <h2 className="text-white/60 text-sm font-medium">
          Allowed emails ({emails.length})
        </h2>

        {loading ? (
          <div className="text-white/30 text-sm">Loading...</div>
        ) : emails.length === 0 ? (
          <div className="border border-white/5 border-dashed rounded-xl p-10 text-center">
            <p className="text-white/30 text-sm">No teammates added yet</p>
            <p className="text-white/20 text-xs mt-1">
              Add emails above to allow registration
            </p>
          </div>
        ) : (
          <div className="border border-white/8 rounded-xl overflow-hidden">
            {emails.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors group ${
                  index !== emails.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-white text-sm">{item.email}</p>
                  <p className="text-white/20 text-xs">
                    Added{" "}
                    {new Date(item.addedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 text-xs transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
