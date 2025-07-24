const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Crear carpeta si no existe
const uploadDir = path.join(__dirname, "..", "static");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `imagen_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Endpoint para subir imagen
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ninguna imagen" });
  }

  const url = `/static/${req.file.filename}`;
  res.status(200).json({ imageUrl: url });
});

module.exports = router;
