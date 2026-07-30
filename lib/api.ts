const API_BASE = "https://devvault-backend-production-d964.up.railway.app";

// ---- Auth ----
export const registerUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ---- Projects ----
export const getProjects = async (token: string) => {
  const res = await fetch(`${API_BASE}/api/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const createProject = async (
  token: string,
  name: string,
  description: string,
) => {
  const res = await fetch(`${API_BASE}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });
  return res.json();
};

export const deleteProject = async (token: string, id: number) => {
  await fetch(`${API_BASE}/api/projects/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ---- Secrets ----
export const getSecretsByProject = async (token: string, projectId: number) => {
  const res = await fetch(`${API_BASE}/api/secrets/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getSecretsByEnvironment = async (
  token: string,
  projectId: number,
  environment: string,
) => {
  const res = await fetch(
    `${API_BASE}/api/secrets/project/${projectId}/env/${environment}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.json();
};

export const createSecret = async (
  token: string,
  data: {
    name: string;
    value: string;
    projectId: number;
    environment: string;
  },
) => {
  const res = await fetch(`${API_BASE}/api/secrets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateSecret = async (
  token: string,
  projectId: number,
  name: string,
  newValue: string,
) => {
  const res = await fetch(
    `${API_BASE}/api/secrets/project/${projectId}/${name}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${token}`,
      },
      body: newValue,
    },
  );
  return res.json();
};

export const deleteSecret = async (
  token: string,
  projectId: number,
  name: string,
) => {
  await fetch(`${API_BASE}/api/secrets/project/${projectId}/${name}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getSecretHistory = async (
  token: string,
  projectId: number,
  name: string,
) => {
  const res = await fetch(
    `${API_BASE}/api/secrets/project/${projectId}/${name}/history`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.json();
};

// ---- Env Import/Export ----
export const importEnvFile = async (
  token: string,
  projectId: number,
  environment: string,
  file: File,
) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(
    `${API_BASE}/api/env/import/${projectId}/${environment}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );
  return res.json();
};

export const exportEnvFile = async (
  token: string,
  projectId: number,
  environment: string,
) => {
  const res = await fetch(
    `${API_BASE}/api/env/export/${projectId}/${environment}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.text();
};

// ---- Audit ----
export const getAuditLogs = async (token: string) => {
  const res = await fetch(`${API_BASE}/api/audit`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ---- Token helpers ----
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};
