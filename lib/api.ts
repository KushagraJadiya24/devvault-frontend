const API_BASE = "https://devvault-backend-production-d964.up.railway.app";

const safeParse = async (res: Response) => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    console.error("Failed to parse response:", text);
    return null;
  }
};

// ---- Auth ----
export const registerUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return safeParse(res);
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return safeParse(res);
};

// ---- Projects ----
export const getProjects = async (token: string) => {
  const res = await fetch(`${API_BASE}/api/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error("getProjects failed:", res.status, res.statusText);
    return [];
  }
  return safeParse(res);
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
  if (!res.ok) {
    console.error("createProject failed:", res.status, res.statusText);
    return null;
  }
  return safeParse(res);
};
export const getProjectById = async (token: string, id: number) => {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return safeParse(res);
};

export const deleteProject = async (token: string, id: number) => {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error("deleteProject failed:", res.status, res.statusText);
  }
};

// ---- Secrets ----
export const getSecretsByProject = async (token: string, projectId: number) => {
  const res = await fetch(`${API_BASE}/api/secrets/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error("getSecretsByProject failed:", res.status, res.statusText);
    return [];
  }
  return safeParse(res);
};
export const getSecretByName = async (
  token: string,
  projectId: number,
  name: string,
) => {
  const res = await fetch(
    `${API_BASE}/api/secrets/project/${projectId}/${name}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!res.ok) return null;
  return res.text();
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
  if (!res.ok) {
    console.error(
      "getSecretsByEnvironment failed:",
      res.status,
      res.statusText,
    );
    return [];
  }
  return safeParse(res);
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
  if (!res.ok) {
    console.error("createSecret failed:", res.status, res.statusText);
    return null;
  }
  return safeParse(res);
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
  if (!res.ok) {
    console.error("updateSecret failed:", res.status, res.statusText);
    return null;
  }
  return safeParse(res);
};

export const deleteSecret = async (
  token: string,
  projectId: number,
  name: string,
) => {
  const res = await fetch(
    `${API_BASE}/api/secrets/project/${projectId}/${name}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!res.ok) {
    console.error("deleteSecret failed:", res.status, res.statusText);
  }
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
  if (!res.ok) {
    console.error("getSecretHistory failed:", res.status, res.statusText);
    return [];
  }
  return safeParse(res);
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
  if (!res.ok) {
    console.error("importEnvFile failed:", res.status, res.statusText);
    return null;
  }
  return safeParse(res);
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
  if (!res.ok) {
    console.error("exportEnvFile failed:", res.status, res.statusText);
    return null;
  }
  return res.text();
};

// ---- Audit ----
export const getAuditLogs = async (token: string) => {
  const res = await fetch(`${API_BASE}/api/audit`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error("getAuditLogs failed:", res.status, res.statusText);
    return [];
  }
  return safeParse(res);
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

// Add these to lib/api.ts

export const getAllowedEmails = async (token: string) => {
  const res = await fetch(`${API_BASE}/api/admin/allowed-emails`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return safeParse(res);
};

export const addAllowedEmail = async (token: string, email: string) => {
  const res = await fetch(`${API_BASE}/api/admin/allowed-emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) return null;
  return safeParse(res);
};

export const removeAllowedEmail = async (token: string, id: number) => {
  await fetch(`${API_BASE}/api/admin/allowed-emails/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};
