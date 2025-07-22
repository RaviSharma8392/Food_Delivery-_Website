import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import { PORT, connectDB } from "./src/config/index.js";
import router from "./src/routes/index.js";
import { getCorsOptions } from "./src/utils/corsOptions.js";



const app = express();

// ✅ Environment-based CORS
const corsOptions = getCorsOptions();
app.use(cors(corsOptions));

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());




// ✅ Testing route
app.get("/", (req, res) => {
  res.send("✅ API Working!");
});

// ✅ Main API routes
app.use("/api", router);

// ✅ Server start
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Failed to start server:", error);
   
  }
};

startServer();
