const express = require("express");
const router = express.Router();
const db = require("../db"); // Asegúrate que este archivo exporta la conexión SQLite

// 🧠 Guardar diagnóstico
router.post("/save", (req, res) => {
  const { userId, grado, confianza, recomendaciones, imageUrl } = req.body;

  if (!userId || !grado || confianza === undefined || !recomendaciones) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    db.prepare(
      `
      INSERT INTO chat_history (user_id, image_url, grado, confianza, recomendaciones)
      VALUES (?, ?, ?, ?, ?)
    `
    ).run(userId, imageUrl, grado, confianza, recomendaciones);

    res.status(200).json({ message: "Guardado exitosamente" });
  } catch (err) {
    console.error("❌ Error al guardar:", err);
    res.status(500).json({ error: "Error al guardar en base de datos" });
  }
});
// 🗑️ Eliminar análisis por ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    const result = db.prepare(`DELETE FROM chat_history WHERE id = ?`).run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    res.json({ message: "Registro eliminado" });
  } catch (err) {
    console.error("❌ Error al eliminar:", err);
    res.status(500).json({ error: "Error al eliminar" });
  }
});

// 📋 Obtener historial
// 📋 Obtener historial
router.get("/history/:userId", (req, res) => {
  const userId = req.params.userId;

  try {
    const history = db
      .prepare(
        `
        SELECT id, image_url, grado, confianza, recomendaciones, timestamp
        FROM chat_history
        WHERE user_id = ?
        ORDER BY timestamp DESC
      `
      )
      .all(userId);

    res.json(
      history.map((item) => ({
        id: item.id, // ✅ NECESARIO para eliminar
        imageUrl: item.image_url,
        grado: item.grado,
        confianza: item.confianza,
        recomendaciones: item.recomendaciones,
        fecha: item.timestamp,
      }))
    );
  } catch (err) {
    console.error("❌ Error al obtener historial:", err);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

module.exports = router;
