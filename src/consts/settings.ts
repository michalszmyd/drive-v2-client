const SETTINGS = {
  HOST_URL: import.meta.env.VITE_HOST_URL,
  API_ORIGIN: import.meta.env.VITE_API_ORIGIN,
  API_URL: import.meta.env.VITE_API_URL,
  API_PREFIX: import.meta.env.VITE_API_PREFIX,
  DEVELOPMENT: import.meta.env.NODE_ENV !== "development",
};

export default SETTINGS;
