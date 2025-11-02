import React, { useEffect, useState, useCallback } from "react";
import { Calendar, Droplet, Star, Loader2, ImageOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // estados por imagen
  const [imageReady, setImageReady] = useState<Record<number, boolean>>({});
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("No hay sesión activa. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    fetch(`http://backend.burn-ia.local:5000/api/chat/history/${userId}`)
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

  const handleImageLoad = useCallback((id: number) => {
    setImageReady((prev) => ({ ...prev, [id]: true }));
    setImageError((prev) => ({ ...prev, [id]: false }));
  }, []);

  const handleImageError = useCallback((id: number) => {
    setImageError((prev) => ({ ...prev, [id]: true }));
    setImageReady((prev) => ({ ...prev, [id]: false }));
  }, []);

  const openDeleteDialog = (id: number) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const eliminarRegistro = async (id: number) => {
    try {
      const res = await fetch(`http://backend.burn-ia.local:5000/api/chat/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setHistorial((prev) => prev.filter((item) => item.id !== id));
        toast.success("Registro eliminado exitosamente.");
      } else {
        toast.error(data.error || "Error al eliminar el registro.");
      }
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      toast.error("Error de red al eliminar el registro.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

        .glassmorphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        .dark .glassmorphism {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
        }

        /* 🔧 Estandarización visual */
        .image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;            /* 👈 Proporción uniforme */
          overflow: hidden;
          border-radius: 12px;
          background: linear-gradient(45deg, rgba(45, 212, 191, 0.1), rgba(20, 184, 166, 0.1));
          border: 1px solid rgba(20, 184, 166, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .normalized-image {
          width: 100%;
          height: 100%;
          object-fit: cover;              /* 👈 recorta sin deformar */
          object-position: center;        /* 👈 centra el recorte */
          transition: opacity 0.3s ease, transform 0.3s ease;
          border-radius: 12px;
        }
        .normalized-image:hover { transform: scale(1.05); }

        .placeholder-abs {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: rgba(20, 184, 166, 0.7);
          gap: 0.5rem;
          background: transparent;
          pointer-events: none;
        }

        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }

        .delete-button {
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-top: 1rem;
        }
        .delete-button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); background: linear-gradient(45deg, #dc2626, #b91c1c); }
        .delete-button:disabled { background: #9ca3af; cursor: not-allowed; transform: none; }

        body { font-family: 'Inter', sans-serif; }

        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(20, 184, 166, 0.5); border-radius: 3px; }
        .dark .scrollbar-thin::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-100 dark:from-zinc-900 dark:via-teal-950 dark:to-black p-4 sm:p-6 flex flex-col items-center scrollbar-thin">
        <div className="glassmorphism p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-teal-600 dark:text-teal-300">
            📋 Historial de Análisis
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-2" />
              <p className="text-gray-500 dark:text-gray-400 text-base">
                Cargando historial...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400 text-base mb-4">
                {error}
              </p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-teal-500 hover:bg-teal-600"
              >
                Ir al Inicio
              </Button>
            </div>
          ) : historial.length === 0 ? (
            <div className="text-center py-12 bg-white/50 dark:bg-zinc-800/50 rounded-lg shadow-md p-8">
              <Droplet className="w-16 h-16 mx-auto mb-4 text-teal-400 opacity-50" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No hay registros de análisis aún.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                ¡Sube una imagen para empezar tu historial!
              </p>
              <Button
                onClick={() => (window.location.href = "/UploadPage")}
                className="mt-4 bg-teal-500 hover:bg-teal-600"
              >
                Subir Imagen
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {historial.map((item) => {
                const ready = !!imageReady[item.id];
                const err = !!imageError[item.id];

                return (
                  <div
                    key={item.id}
                    className="bg-white/50 dark:bg-zinc-800/50 rounded-xl shadow-md p-5 border border-teal-200/50 dark:border-teal-900/50 card-hover"
                  >
                    <div className="image-container mb-4">
                      {!err && (
                        <img
                          src={item.imageUrl}
                          alt={`Análisis de quemadura de ${item.grado} grado`}
                          className={`normalized-image ${
                            ready ? "opacity-100" : "opacity-0"
                          }`}
                          onLoad={() => handleImageLoad(item.id)}
                          onError={() => handleImageError(item.id)}
                          loading="lazy"
                          decoding="async"
                        />
                      )}

                      {!ready && !err && (
                        <div className="placeholder-abs">
                          <Droplet className="w-12 h-12 animate-pulse" />
                          <span className="text-sm text-teal-500">
                            Cargando imagen...
                          </span>
                        </div>
                      )}

                      {err && (
                        <div className="placeholder-abs">
                          <ImageOff className="w-10 h-10" />
                          <span className="text-sm text-red-500">
                            No se pudo cargar la imagen
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <p
                        className={`text-lg font-semibold ${getColorForGrade(
                          item.grado
                        )} flex items-center`}
                      >
                        <Droplet className="w-4 h-4 mr-2" /> {item.grado}
                      </p>
                      <p className="text-sm text-teal-600 dark:text-teal-400 flex items-center">
                        <Star className="w-4 h-4 mr-2" /> Confianza:{" "}
                        <span className="font-semibold ml-1">
                          {item.confianza}%
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />{" "}
                        {new Date(item.fecha).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p
                        className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3"
                        title={item.recomendaciones}
                      >
                        <strong>Recomendaciones:</strong> {item.recomendaciones}
                      </p>
                    </div>

                    <button
                      onClick={() => openDeleteDialog(item.id)}
                      className="delete-button"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glassmorphism p-6 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
              <Droplet className="w-5 h-5" /> ¿Eliminar registro?
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Esta acción eliminará permanentemente este análisis de tu historial.
            No se puede deshacer.
          </p>
          <DialogFooter className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={async () => {
                if (selectedId !== null) {
                  await eliminarRegistro(selectedId);
                  setDialogOpen(false);
                }
              }}
            >
              Confirmar Eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </>
  );
};

export default HistoryPage;
