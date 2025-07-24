const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(
      email,
      hashed
    );
    res.json({ message: "Usuario creado correctamente" });
  } catch (err) {
    res.status(400).json({ error: "Correo ya registrado" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

  res.json({ message: "Login correcto", userId: user.id });
});

module.exports = router;
