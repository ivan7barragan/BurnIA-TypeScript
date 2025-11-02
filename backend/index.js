const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
// Middlewares
app.use(cors());
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "static")));
// Rutas
const chatRoutes = require("./routes/chat");
const authRoutes = require("./routes/auth");

const uploadRoutes = require("./routes/upload");
app.use("/api", uploadRoutes);

app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

// Puerto
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://10.0.20.50:${PORT}`);
});
