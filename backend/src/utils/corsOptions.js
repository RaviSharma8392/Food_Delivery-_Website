export const getCorsOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    origin: isProd ? "https://munchiza.netlify.app" : "https://munchiza.netlify.app",
    credentials: true,
  };
};
