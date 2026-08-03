"use client";

import { useEffect, useState } from "react";
import { getProjects, createProject, deleteProject, getToken } from "@/lib/api";
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

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchProjects = async () => {
    const token = getToken();
    if (!token) return;
    const data = await getProjects(token);
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    const token = getToken();
    if (!token || !name.trim()) return;
    setCreating(true);
    await createProject(token, name, description);
    setName("");
    setDescription("");
    setOpen(false);
    setCreating(false);
    fetchProjects();
  };

  const handleDelete = async (id: number) => {
    const token = getToken();
    if (!token) return;
    await deleteProject(token, id);
    fetchProjects();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold tracking-[-0.02em]">
            Projects
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Organize your secrets by project
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-white/90 text-sm h-9">
              + New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111111] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white tracking-[-0.02em]">
                Create project
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-white/60 text-sm">Name</Label>
                <Input
                  placeholder="Payment Service"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60 text-sm">Description</Label>
                <Input
                  placeholder="All payment related secrets"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10"
                />
              </div>
              <Button
                className="w-full bg-white text-black hover:bg-white/90"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects grid */}
      {loading ? (
        <div className="text-white/30 text-sm">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="border border-white/5 border-dashed rounded-xl p-16 text-center">
          <div className="text-3xl mb-3">📁</div>
          <p className="text-white/40 text-sm">No projects yet</p>
          <p className="text-white/20 text-xs mt-1">
            Create your first project to start storing secrets
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group border border-white/8 rounded-xl p-5 bg-white/2 hover:bg-white/4 hover:border-white/15 transition-all cursor-pointer"
              onClick={() => (window.location.href = `/project/${project.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📁</span>
                    <h3 className="text-white font-medium text-sm tracking-[-0.01em]">
                      {project.name}
                    </h3>
                  </div>
                  {project.description && (
                    <p className="text-white/30 text-xs leading-relaxed pl-6">
                      {project.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 text-xs transition-all ml-2"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-white/20 text-xs">
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-white/20 text-xs group-hover:text-white/40 transition-colors">
                  View secrets →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
