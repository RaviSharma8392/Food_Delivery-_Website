export const getCorsOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    origin: isProd ? "https://munchiza.netlify.app" : "https://munchiza.netlify.app",
        // origin: isProd ? "http://localhost:5173" : "http://localhost:5173",

    credentials: true,
  };
};
