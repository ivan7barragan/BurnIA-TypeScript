import React, { useEffect, useState } from "react";
import { Calendar, Droplet, Star } from "lucide-react";

interface Registro {
  id: number;
  imageUrl: string;
  grado: string;
  confianza: number;
  recomendaciones: string;
  fecha: string;
}

const getColorForGrade = (grado: string) => {
  switch (grado.toLowerCase()) {
    case "primer grado":
      return "text-green-600 dark:text-green-400";
    case "segundo grado":
      return "text-yellow-600 dark:text-yellow-400";
    case "tercer grado":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

const HistoryPage: React.FC = () => {
  const [historial, setHistorial] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("No hay sesión activa. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/chat/history/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener historial");
        return res.json();
      })
      .then((data) => {
        const sortedData = data.sort(
          (a: Registro, b: Registro) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        setHistorial(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        setError(
          "No se pudo cargar el historial. Inténtalo de nuevo más tarde."
        );
        setLoading(false);
      });
  }, []);

  const eliminarRegistro = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este registro?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/chat/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setHistorial((prev) => prev.filter((item) => item.id !== id));
        alert("Registro eliminado exitosamente.");
      } else {
        alert(data.error || "Error al eliminar el registro.");
      }
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      alert("Error de red al eliminar el registro.");
    }
  };

  return (
    <>
      <style>{`
        .uiverse-button {
          background: #e0f2f1; /* Light teal background */
          color: #1f2937; /* Dark gray text */
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 8px;
          padding: 12px 28px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1.1rem;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 0 8px rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .uiverse-button:hover:not(:disabled) {
          background: #14b8a6; /* Vibrant teal on hover */
          color: white;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 16px rgba(20, 184, 166, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2);
        }

        .uiverse-button:disabled {
          background: #d1d5db; /* Muted gray for disabled */
          color: #9ca3af;
          box-shadow: none;
          transform: none;
          cursor: not-allowed;
        }

        .uiverse-button.delete {
          background: #f87171; /* Light red for delete */
          color: white;
          border: 1px solid rgba(248, 113, 113, 0.2);
        }

        .uiverse-button.delete:hover:not(:disabled) {
          background: #ef4444; /* Vibrant red on hover */
          color: white;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2);
        }

        .glassmorphism {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border-radius: 20px;
        }

        .dark .glassmorphism {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-100 dark:from-zinc-900 dark:via-teal-950 dark:to-black p-6 flex flex-col items-center">
        <div className="glassmorphism p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-teal-600 dark:text-teal-300">
            📋 Historial de Análisis
          </h2>
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 text-center text-base animate-pulse">
              Cargando historial...
            </p>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400 text-center text-base">
              {error}
            </p>
          ) : historial.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-center text-base p-8 bg-white/50 dark:bg-zinc-800/50 rounded-lg shadow-md">
              <p className="mb-3">No hay registros de análisis aún.</p>
              <p>¡Sube una imagen para empezar!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historial.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/50 dark:bg-zinc-800/50 rounded-xl shadow-md p-5 border border-teal-200/50 dark:border-teal-900/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-full h-48 bg-teal-50/50 dark:bg-teal-900/30 rounded-lg mb-4 flex items-center justify-center overflow-hidden shadow-md border border-teal-200/50 dark:border-teal-900/50">
                    <img
                      src={item.imageUrl}
                      alt={`Imagen de quemadura ${item.id}`}
                      className="max-h-48 max-w-full object-contain rounded-md shadow-md border border-teal-200/30 dark:border-teal-900/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <p
                      className={`text-lg font-semibold ${getColorForGrade(
                        item.grado
                      )} flex items-center`}
                    >
                      <Droplet className="w-4 h-4 mr-2" /> Grado: {item.grado}
                    </p>
                    <p className="text-sm text-teal-600 dark:text-teal-400 flex items-center">
                      <Star className="w-4 h-4 mr-2" /> Confianza:{" "}
                      <span className="font-semibold ml-1">
                        {item.confianza}%
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" /> {item.fecha}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      <strong>Recomendaciones:</strong> {item.recomendaciones}
                    </p>
                  </div>
                  <button
                    onClick={() => eliminarRegistro(item.id)}
                    className="mt-4 w-1/2 mx-auto uiverse-button delete"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
