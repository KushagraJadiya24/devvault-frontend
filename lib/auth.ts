import { getToken, removeToken } from "./api";

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

export const logout = () => {
  removeToken();
  window.location.href = "/login";
};
