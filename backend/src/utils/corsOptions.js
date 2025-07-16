export const getCorsOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    origin: isProd ? "https://your-production-domain.com" : "http://localhost:5173",
    credentials: true,
  };
};
