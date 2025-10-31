import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Send, Bot, ArrowRight, CheckCircle, ImagePlus } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp?: Date;
  isButton?: boolean;
  onClick?: () => void;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageUrl = sessionStorage.getItem("burnImage"); // puede ser base64 o URL del server

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = useCallback(
    (
      sender: "user" | "bot",
      text: string,
      options?: { isButton?: boolean; onClick?: () => void }
    ) => {
      const newMessage: Message = {
        id: Date.now().toString() + Math.random(),
        sender,
        text,
        timestamp: new Date(),
        ...(options || {}),
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    []
  );

  const simulateTyping = useCallback(
    async (text: string, delay: number = 20) => {
      setIsTyping(true);
      await new Promise((r) =>
        setTimeout(r, Math.min(1200, text.length * delay))
      );
      setIsTyping(false);
      addMessage("bot", text);
    },
    [addMessage]
  );

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const base64ToFile = useCallback((base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }, []);

  const handleViewResults = () => {
    navigate("/result", { replace: true });
  };
  const handleUpload = () => {
    navigate("/UploadPage");
  };

  const mapGradeToSpanish = (grado: string): string => {
    const maps: Record<string, string> = {
      "1st degree burn": "Primer Grado",
      "2nd degree burn": "Segundo Grado",
      "3rd degree burn": "Tercer Grado",
    };
    return maps[grado] || grado;
  };

  useEffect(() => {
    // ✅ NO redirige si no hay imagen; solo muestra opciones en la misma pantalla.
    if (!imageUrl) {
      setFatalError("No encontré una imagen para analizar.");
      addMessage("bot", "No encontré una imagen para analizar.");
      addMessage("bot", "", { isButton: true, onClick: handleUpload });
      return;
    }

    const processDiagnosis = async () => {
      setIsProcessing(true);
      try {
        addMessage(
          "user",
          "He subido una imagen de la quemadura para analizar."
        );
        await wait(400);
        await simulateTyping(
          "Hola, soy la IA médica para detección de quemaduras. Recibí tu imagen. Analizando..."
        );

        // Si es base64 la convierto; si es URL (procesada), la vuelvo a pedir al endpoint de predicción no tiene sentido: sólo se predice a partir de imagen original, no de la procesada.
        // Por eso, solo lanzamos predicción si venimos con base64. Si venimos desde recarga con URL procesada, mostramos botón para ver resultados si ya existen en sessionStorage.
        if (!imageUrl.startsWith("data:image")) {
          // No re-procesar; solo esperar que ya exista el diagnóstico guardado.
          const saved = sessionStorage.getItem("diagnosticoQuemadura");
          if (saved) {
            const data = JSON.parse(saved);
            const displayGrado = mapGradeToSpanish(data.grado || "");
            await simulateTyping(
              `¡Listo! Tu quemadura es de ${displayGrado} con un ${data.confianza}% de confianza.`
            );
            await wait(300);
            addMessage(
              "bot",
              "✅ Tu diagnóstico se ha guardado en tu historial."
            );
            await wait(300);
            addMessage("bot", "", {
              isButton: true,
              onClick: handleViewResults,
            });
            setIsComplete(true);
            return;
          } else {
            // No hay diagnóstico en memoria pero sí imagen URL. Ofrecer re-subir imagen.
            setFatalError(
              "No hay diagnóstico en memoria. Vuelve a subir una imagen para analizar."
            );
            await simulateTyping(
              "No hay diagnóstico en memoria. Vuelve a subir una imagen para analizar."
            );
            addMessage("bot", "", { isButton: true, onClick: handleUpload });
            return;
          }
        }

        // 1) Subir y predecir
        const file = base64ToFile(imageUrl, "burn-image.jpg");

        const formData = new FormData();
        formData.append("image", file);
        const uploadRes = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok)
          throw new Error("Error al subir imagen al almacenamiento");

        const predictForm = new FormData();
        predictForm.append("image", file);
        const res = await fetch("http://127.0.0.1:5001/predict", {
          method: "POST",
          body: predictForm,
        });

        if (!res.ok) {
          let errorMessage = "Error en el análisis de la IA";
          try {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } catch {}
          throw new Error(errorMessage);
        }

        const data = await res.json();

        // 2) Normalizar respuesta
        let finalGrado: string = data.grado;
        let finalConfianza: number = data.confianza;
        if (!finalGrado || finalGrado === "No detectado") {
          const match = String(data.recomendaciones || "").match(
            /(\d+(?:st|nd|rd|th)? degree burn)\s+(\d+\.?\d*)/i
          );
          if (match) {
            finalGrado = match[1];
            finalConfianza = parseFloat(match[2]);
            if (finalConfianza <= 1) finalConfianza *= 100;
          } else {
            throw new Error("No se pudo extraer diagnóstico de la respuesta.");
          }
        }

        const processedImage = data.processedImage || "";
        const savedImageUrl = processedImage
          ? `http://localhost:5001${processedImage}`
          : imageUrl;

        // ✅ Guardar para /result (NO setStorage, NO borrar)
        sessionStorage.setItem("burnImage", savedImageUrl);
        sessionStorage.setItem(
          "diagnosticoQuemadura",
          JSON.stringify({
            ...data,
            grado: finalGrado,
            confianza: finalConfianza,
          })
        );

        // 3) Mensaje de diagnóstico
        const displayGrado = mapGradeToSpanish(finalGrado);
        await simulateTyping(
          `¡Análisis completado! Tu quemadura es de ${displayGrado} con un ${finalConfianza}% de confianza.`
        );
        await wait(300);

        // 4) Guardar en historial (si hay userId)
        let saveMessage = "";
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
          const userId = Number(storedUserId);
          if (!isNaN(userId)) {
            try {
              const saveRes = await fetch(
                "http://localhost:5000/api/chat/save",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId,
                    imageUrl: savedImageUrl,
                    grado: finalGrado,
                    confianza: finalConfianza,
                    recomendaciones: data.recomendaciones,
                  }),
                }
              );

              if (saveRes.ok) {
                saveMessage =
                  "✅ Tu diagnóstico se ha guardado en tu historial.";
                toast.success("Tu diagnóstico se guardó en el historial");
              } else {
                const saveError = await saveRes.json();
                saveMessage = `⚠️ Diagnóstico completado, pero no se pudo guardar en historial: ${saveError.error}`;
                toast.warn(saveMessage);
              }
            } catch {
              saveMessage =
                "⚠️ Error al guardar en historial. Puedes intentarlo más tarde.";
              toast.warn(saveMessage);
            }
          }
        } else {
          saveMessage = "ℹ️ Inicia sesión para guardar en historial.";
        }

        await simulateTyping(saveMessage);
        await wait(200);

        // 5) Botón "Ver Resultados"
        addMessage("bot", "", { isButton: true, onClick: handleViewResults });

        setIsComplete(true);
        // ❌ NO borrar burnImage aquí
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Error desconocido en el análisis.";
        setFatalError(errorMsg);
        await simulateTyping(
          `Lo siento, ocurrió un error: ${errorMsg}. Puedes quedarte aquí y reintentar o subir otra imagen.`
        );
        // ❌ NO navegar; solo ofrecer botón
        addMessage("bot", "Subir otra imagen", {
          isButton: true,
          onClick: handleUpload,
        });
        toast.error(errorMsg);
      } finally {
        setIsProcessing(false);
      }
    };

    processDiagnosis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <- importante: sin dependencias para no triggerear re-ejecuciones

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');
        .glassmorphism{background:rgba(255,255,255,0.1);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.15);box-shadow:0 10px 40px rgba(0,0,0,0.15);border-radius:20px;transition:all .3s ease;}
        .dark .glassmorphism{background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.1);box-shadow:0 10px 40px rgba(0,0,0,0.35);}
        .chat-bubble{animation:fadeIn .3s ease-out;}@keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        .results-button{background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:8px;padding:10px 20px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .3s ease;box-shadow:0 4px 12px rgba(16,185,129,.3);margin-top:8px;}
        .results-button:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(16,185,129,.4);}
        body{font-family:'Inter',sans-serif;}
        .inline-actions{display:flex;gap:.5rem;margin-top:.5rem;}
        .inline-btn{display:inline-flex;align-items:center;gap:.5rem;border:1px solid rgba(16,185,129,.3);padding:.5rem .75rem;border-radius:.5rem;}
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-100 dark:from-zinc-900 dark:via-teal-950 dark:to-black flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="glassmorphism p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col h-[70vh] sm:h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-300 flex items-center gap-2">
              <Bot className="w-6 h-6" />
              Chat de Diagnóstico
            </h2>
            {isProcessing && (
              <div className="text-sm text-teal-500 dark:text-teal-400 animate-pulse">
                Procesando...
              </div>
            )}
          </div>

          <div className="flex-1 bg-white/50 dark:bg-zinc-800/50 p-4 rounded-lg overflow-y-auto shadow-inner border border-teal-200/50 dark:border-teal-900/50 mb-4">
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`chat-bubble rounded-xl px-4 py-2 max-w-[80%] text-sm shadow-md transition-all duration-200 ${
                      msg.sender === "bot"
                        ? "bg-teal-100 text-gray-800 dark:bg-teal-900/70 dark:text-gray-200"
                        : "bg-teal-500 text-white dark:bg-teal-600"
                    }`}
                  >
                    {msg.sender === "bot" && !msg.isButton && (
                      <Bot className="inline w-4 h-4 mr-2 mb-1" />
                    )}
                    {msg.text}
                    {msg.isButton && (
                      <button onClick={msg.onClick} className="results-button">
                        {msg.text ? (
                          <ImagePlus size={16} />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                        {msg.text || "Ver Resultados"} <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-teal-100/50 dark:bg-teal-900/50 text-gray-500 dark:text-gray-400 text-sm px-4 py-3 rounded-xl shadow animate-pulse">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <span>Escribiendo…</span>
                    </div>
                  </div>
                </div>
              )}

              {fatalError && (
                <div className="flex justify-start">
                  <div className="bg-red-100/70 dark:bg-red-900/40 text-red-800 dark:text-red-200 text-sm px-4 py-3 rounded-xl shadow">
                    {fatalError}
                    <div className="inline-actions">
                      <button className="inline-btn" onClick={handleUpload}>
                        <ImagePlus size={16} /> Subir otra imagen
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div
            className={`flex gap-2 ${
              isComplete
                ? "opacity-100 pointer-events-auto"
                : "opacity-50 pointer-events-none"
            }`}
            title={isComplete ? "" : "Procesamiento automático en curso"}
          ></div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
