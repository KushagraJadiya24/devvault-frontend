"use client";

import { useEffect, useState } from "react";
import { getAuditLogs, getToken } from "@/lib/api";

interface AuditLog {
  id: number;
  userId: number;
  action: string;
  secretName: string;
  ipAddress: string;
  timestamp: string;
}

const actionColors: Record<string, string> = {
  CREATE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  READ: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  UPDATE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
  IMPORT: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = getToken();
      if (!token) return;
      const data = await getAuditLogs(token);
      setLogs(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-semibold tracking-[-0.02em]">
          Audit Log
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Every secret access and modification recorded
        </p>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm">Loading audit logs...</div>
      ) : logs.length === 0 ? (
        <div className="border border-white/5 border-dashed rounded-xl p-16 text-center">
          <div className="text-3xl mb-3">📋</div>
          <p className="text-white/40 text-sm">No activity yet</p>
          <p className="text-white/20 text-xs mt-1">
            Actions on secrets will appear here
          </p>
        </div>
      ) : (
        <div className="border border-white/8 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/5 bg-white/2">
            <div className="col-span-2 text-white/30 text-xs uppercase tracking-wider">
              Action
            </div>
            <div className="col-span-3 text-white/30 text-xs uppercase tracking-wider">
              Secret
            </div>
            <div className="col-span-2 text-white/30 text-xs uppercase tracking-wider">
              User ID
            </div>
            <div className="col-span-3 text-white/30 text-xs uppercase tracking-wider">
              IP Address
            </div>
            <div className="col-span-2 text-white/30 text-xs uppercase tracking-wider">
              Time
            </div>
          </div>

          {logs.map((log, index) => (
            <div
              key={log.id}
              className={`grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-white/2 transition-colors ${
                index !== logs.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="col-span-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-md border ${actionColors[log.action] || "bg-white/5 text-white/40 border-white/10"}`}
                >
                  {log.action}
                </span>
              </div>
              <div className="col-span-3">
                <span className="text-white font-mono text-sm">
                  {log.secretName}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-white/40 text-sm">#{log.userId}</span>
              </div>
              <div className="col-span-3">
                <span className="text-white/40 text-sm font-mono">
                  {log.ipAddress}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-white/30 text-xs">
                  {new Date(log.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
