import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"; // 👈 New
import { Server as SocketServer } from "socket.io"; // 👈 New

import { PORT, connectDB } from "./src/config/index.js";
import router from "./src/routes/index.js";
import { getCorsOptions } from "./src/utils/corsOptions.js";

// ✅ Express setup
const app = express();

// ✅ Create HTTP server for socket.io
const server = http.createServer(app);

// ✅ Attach socket.io
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "*", // or whitelist frontend
    credentials: true,
  },
});

// ✅ Make `io` accessible throughout app
export { io };

// ✅ Middleware
app.use(cors(getCorsOptions()));
app.use(cookieParser());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ API Working!");
});

// ✅ Main API
app.use("/api", router);

// ✅ Socket event handling
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
