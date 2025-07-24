import React from "react";

const HelpGuide: React.FC = () => (
  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-sm text-gray-800 mb-4">
    <h2 className="font-bold mb-2">¿Cómo funciona?</h2>
    <ul className="list-disc pl-4 space-y-1">
      <li>1️⃣ Sube una imagen de la quemadura.</li>
      <li>💬 La IA simula una conversación médica.</li>
      <li>📊 Recibes un diagnóstico con recomendaciones.</li>
      <li>📁 Puedes ver tu historial en cualquier momento.</li>
    </ul>
  </div>
);

export default HelpGuide;
