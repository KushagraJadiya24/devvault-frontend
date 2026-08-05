"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getSecretsByProject,
  getSecretsByEnvironment,
  createSecret,
  updateSecret,
  deleteSecret,
  importEnvFile,
  exportEnvFile,
  getToken,
  getProjectById,
  getSecretByName,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Secret {
  id: number;
  name: string;
  encryptedValue: string;
  environment: string;
  version: number;
  createdAt: string;
  active: boolean;
}

const ENVIRONMENTS = ["ALL", "DEVELOPMENT", "STAGING", "PRODUCTION"];

const envColors: Record<string, string> = {
  DEVELOPMENT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  STAGING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PRODUCTION: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function ProjectPage() {
  const params = useParams();
  const projectId = Number(params.id);

  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEnv, setActiveEnv] = useState("ALL");
  const [createOpen, setCreateOpen] = useState(false);
  const [editSecret, setEditSecret] = useState<Secret | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [revealedSecret, setRevealedSecret] = useState<{
    name: string;
    value: string;
  } | null>(null);

  // Create form state
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newEnv, setNewEnv] = useState("DEVELOPMENT");
  const [creating, setCreating] = useState(false);

  const fetchSecrets = async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    let data;
    if (activeEnv === "ALL") {
      data = await getSecretsByProject(token, projectId);
    } else {
      data = await getSecretsByEnvironment(token, projectId, activeEnv);
    }
    setSecrets(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const fetchProject = async () => {
    const token = getToken();
    if (!token) return;
    const data = await getProjectById(token, projectId);
    if (data?.name) setProjectName(data.name);
  };

  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
    fetchSecrets();
  }, [activeEnv]);

  const handleCreate = async () => {
    const token = getToken();
    if (!token || !newName.trim() || !newValue.trim()) return;
    setCreating(true);
    await createSecret(token, {
      name: newName,
      value: newValue,
      projectId,
      environment: newEnv,
    });
    setNewName("");
    setNewValue("");
    setNewEnv("DEVELOPMENT");
    setCreateOpen(false);
    setCreating(false);
    fetchSecrets();
  };

  const handleUpdate = async () => {
    const token = getToken();
    if (!token || !editSecret || !editValue.trim()) return;
    await updateSecret(token, projectId, editSecret.name, editValue);
    setEditOpen(false);
    setEditSecret(null);
    setEditValue("");
    fetchSecrets();
  };

  const handleDelete = async (name: string) => {
    const token = getToken();
    if (!token) return;
    await deleteSecret(token, projectId, name);
    fetchSecrets();
  };

  const handleReveal = async (name: string) => {
    const token = getToken();
    if (!token) return;
    if (revealedSecret?.name === name) {
      setRevealedSecret(null);
      return;
    }
    const value = await getSecretByName(token, projectId, name);
    if (value) setRevealedSecret({ name, value });
  };

  const handleCopy = async (name: string) => {
    const token = getToken();
    if (!token) return;
    const value = await getSecretByName(token, projectId, name);
    if (value) {
      try {
        await navigator.clipboard.writeText(value);
        setCopiedName(name);
        setTimeout(() => setCopiedName(null), 2000);
      } catch {
        const el = document.createElement("textarea");
        el.value = value;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopiedName(name);
        setTimeout(() => setCopiedName(null), 2000);
      }
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = getToken();
    if (!token || !e.target.files?.[0]) return;
    await importEnvFile(
      token,
      projectId,
      activeEnv === "ALL" ? "DEVELOPMENT" : activeEnv,
      e.target.files[0],
    );
    fetchSecrets();
  };

  const handleExport = async () => {
    const token = getToken();
    if (!token) return;
    const env = activeEnv === "ALL" ? "DEVELOPMENT" : activeEnv;
    const content = await exportEnvFile(token, projectId, env);
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `.env.${env.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-white/30 text-sm mb-1">
            <a href="/dashboard" className="hover:text-white transition-colors">
              Projects
            </a>
            <span>/</span>
            <span className="text-white/60">{projectName}</span>
          </div>
          <h1 className="text-white text-2xl font-semibold tracking-[-0.02em]">
            {projectName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Import */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".env"
              className="hidden"
              onChange={handleImport}
            />
            <span className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 transition-all cursor-pointer">
              ↑ Import .env
            </span>
          </label>

          {/* Export */}
          <button
            onClick={handleExport}
            className="text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 transition-all"
          >
            ↓ Export .env
          </button>

          {/* Create */}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-white/90 text-sm h-9">
                + New Secret
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111111] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-white tracking-[-0.02em]">
                  Add secret
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm">Name</Label>
                  <Input
                    placeholder="STRIPE_API_KEY"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value.toUpperCase())}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm">Value</Label>
                  <Input
                    placeholder="sk_test_..."
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm">Environment</Label>
                  <div className="flex gap-2">
                    {["DEVELOPMENT", "STAGING", "PRODUCTION"].map((env) => (
                      <button
                        key={env}
                        onClick={() => setNewEnv(env)}
                        className={`text-xs px-3 py-1.5 rounded-md border transition-all ${
                          newEnv === env
                            ? "bg-white text-black border-white"
                            : "border-white/10 text-white/40 hover:border-white/20"
                        }`}
                      >
                        {env.charAt(0) + env.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  className="w-full bg-white text-black hover:bg-white/90"
                  onClick={handleCreate}
                  disabled={creating}
                >
                  {creating ? "Adding..." : "Add secret"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Environment tabs */}
      <div className="flex gap-1 border-b border-white/5 pb-0">
        {ENVIRONMENTS.map((env) => (
          <button
            key={env}
            onClick={() => setActiveEnv(env)}
            className={`text-sm px-4 py-2 transition-all border-b-2 -mb-px ${
              activeEnv === env
                ? "text-white border-white"
                : "text-white/30 border-transparent hover:text-white/60"
            }`}
          >
            {env.charAt(0) + env.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Secrets list */}
      {loading ? (
        <div className="text-white/30 text-sm">Loading secrets...</div>
      ) : secrets.length === 0 ? (
        <div className="border border-white/5 border-dashed rounded-xl p-16 text-center">
          <div className="text-3xl mb-3">🔑</div>
          <p className="text-white/40 text-sm">No secrets yet</p>
          <p className="text-white/20 text-xs mt-1">
            Add a secret or import a .env file
          </p>
        </div>
      ) : (
        <div className="border border-white/8 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/5 bg-white/2">
            <div className="col-span-4 text-white/30 text-xs uppercase tracking-wider">
              Name
            </div>
            <div className="col-span-3 text-white/30 text-xs uppercase tracking-wider">
              Environment
            </div>
            <div className="col-span-2 text-white/30 text-xs uppercase tracking-wider">
              Version
            </div>
            <div className="col-span-2 text-white/30 text-xs uppercase tracking-wider">
              Updated
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Secrets rows */}
          {secrets.map((secret, index) => (
            <div
              key={secret.id}
              className={`grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-white/2 transition-colors group ${
                index !== secrets.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="col-span-4">
                <span className="text-white font-mono text-sm">
                  {secret.name}
                </span>
                {revealedSecret?.name === secret.name && (
                  <p className="text-emerald-400/70 font-mono text-xs mt-1 break-all">
                    {revealedSecret.value}
                  </p>
                )}
              </div>
              <div className="col-span-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-md border ${envColors[secret.environment] || ""}`}
                >
                  {secret.environment.charAt(0) +
                    secret.environment.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-white/30 text-sm">v{secret.version}</span>
              </div>
              <div className="col-span-2">
                <span className="text-white/30 text-xs">
                  {new Date(secret.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="col-span-1 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleReveal(secret.name)}
                  className={`text-xs transition-colors ${
                    revealedSecret?.name === secret.name
                      ? "text-emerald-400"
                      : "text-white/30 hover:text-white"
                  }`}
                >
                  👁
                </button>
                <button
                  onClick={() => handleCopy(secret.name)}
                  className={`text-xs transition-colors ${
                    copiedName === secret.name
                      ? "text-emerald-400"
                      : "text-white/30 hover:text-white"
                  }`}
                >
                  {copiedName === secret.name ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => {
                    setEditSecret(secret);
                    setEditOpen(true);
                  }}
                  className="text-white/30 hover:text-white text-xs transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(secret.name)}
                  className="text-white/30 hover:text-red-400 text-xs transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-[#111111] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white tracking-[-0.02em]">
              Update secret
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Name</Label>
              <Input
                value={editSecret?.name || ""}
                disabled
                className="bg-white/5 border-white/10 text-white/40 h-10 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">New Value</Label>
              <Input
                placeholder="Enter new value..."
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10 font-mono"
              />
            </div>
            <p className="text-white/20 text-xs">
              This will create a new version. Old value is preserved in history.
            </p>
            <Button
              className="w-full bg-white text-black hover:bg-white/90"
              onClick={handleUpdate}
            >
              Update secret
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
