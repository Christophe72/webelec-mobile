// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
  },
  // Clients
  CLIENTS: {
    BASE: "/api/clients",
    BY_ID: (id: number) => `/api/clients/${id}`,
  },
  // Chantiers
  CHANTIERS: {
    BASE: "/api/chantiers",
    BY_ID: (id: number) => `/api/chantiers/${id}`,
    BY_SOCIETE: (societeId: number) => `/api/chantiers/societe/${societeId}`,
  },
};
