import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const imageUrl = sessionStorage.getItem("burnImage");

  useEffect(() => {
    if (!imageUrl) {
      navigate("/");
      return;
    }

    const simulateChat = async () => {
      addBotMessage("Hola, soy la IA médica para detección de quemaduras.");
      await wait(1500);
      addBotMessage("Imagen recibida. Analizando...");
      await wait(1500);

      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "imagen.jpg", { type: blob.type });

        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error("Error al subir imagen");
        }

        const savedImageUrl = "http://localhost:5000" + uploadData.imageUrl;

        const predictForm = new FormData();
        predictForm.append("image", file);

        const res = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          body: predictForm,
        });

        const data = await res.json();

        if (res.ok) {
          sessionStorage.setItem("diagnosticoQuemadura", JSON.stringify(data));
          addBotMessage(`Diagnóstico: ${data.grado} (${data.confianza}%)`);
          await wait(2500);

          const userId = localStorage.getItem("userId");
          if (userId) {
            try {
              const saveRes = await fetch(
                "http://localhost:5000/api/chat/save",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId,
                    imageUrl: savedImageUrl,
                    grado: data.grado,
                    confianza: data.confianza,
                    recomendaciones: data.recomendaciones,
                  }),
                }
              );

              const saveData = await saveRes.json();
              if (!saveRes.ok) {
                console.error(
                  "❌ Error al guardar diagnóstico:",
                  saveData.error
                );
              } else {
                console.log(
                  "✅ Diagnóstico guardado correctamente:",
                  saveData.message
                );
              }
            } catch (err) {
              console.error("❌ Error de red al guardar diagnóstico:", err);
            }
          } else {
            console.warn(
              "No hay userId en localStorage. No se guardó el diagnóstico."
            );
          }

          navigate("/result");
        } else {
          addBotMessage("❌ Error del servidor: " + data.error);
        }
      } catch (err) {
        console.error(err);
        addBotMessage("❌ Error al conectar con el servidor.");
      }
    };

    simulateChat();
  }, [imageUrl, navigate]);

  const addBotMessage = async (text: string) => {
    setIsTyping(true);
    await wait(800);
    setIsTyping(false);
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-100 dark:from-zinc-900 dark:via-teal-950 dark:to-black flex flex-col items-center justify-center p-6">
      <div className="glassmorphism p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-xl flex flex-col h-[600px]">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-teal-600 dark:text-teal-300">
          💬 Chat de Diagnóstico
        </h2>
        <div className="flex-1 bg-white/50 dark:bg-zinc-800/50 p-4 rounded-lg overflow-y-auto shadow-inner border border-teal-200/50 dark:border-teal-900/50">
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "bot" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`rounded-xl px-4 py-2 max-w-[80%] text-sm shadow-md transition-all duration-200
                    ${
                      msg.sender === "bot"
                        ? "bg-teal-100 text-gray-800 dark:bg-teal-900/70 dark:text-gray-200"
                        : "bg-teal-500 text-white dark:bg-teal-600"
                    }`}
                >
                  {msg.sender === "bot" && (
                    <span className="mr-2 text-lg">🤖</span>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-teal-100/50 dark:bg-teal-900/50 text-gray-500 dark:text-gray-400 text-sm px-4 py-2 rounded-xl shadow animate-pulse flex items-center">
                  <span className="mr-2 text-lg">🤖</span>
                  <div className="dot-typing"></div>
                  <style>{`
                    .dot-typing {
                      position: relative;
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                      background-color: #6b7280;
                      animation: dotTyping 1.5s infinite ease-in-out;
                    }
                    .dot-typing::before, .dot-typing::after {
                      content: '';
                      position: absolute;
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                      background-color: #6b7280;
                    }
                    .dot-typing::before { left: -10px; animation-delay: 0s; }
                    .dot-typing::after { left: 10px; animation-delay: 0.2s; }
                    @keyframes dotTyping {
                      0%, 80%, 100% { transform: scale(0); }
                      40% { transform: scale(1); }
                    }
                  `}</style>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
