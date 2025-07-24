import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronRight,
  History,
} from "lucide-react";

interface DiagnosisResult {
  grado: string;
  confianza: number;
  recomendaciones: string;
}

const getColorAndIcon = (grado: string) => {
  switch (grado.toLowerCase()) {
    case "primer grado":
      return {
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100/50 dark:bg-green-900/30",
        icon: <CheckCircle className="w-6 h-6" />,
      };
    case "segundo grado":
      return {
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-100/50 dark:bg-yellow-900/30",
        icon: <AlertTriangle className="w-6 h-6" />,
      };
    case "tercer grado":
      return {
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100/50 dark:bg-red-900/30",
        icon: <XCircle className="w-6 h-6" />,
      };
    default:
      return {
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-100/50 dark:bg-gray-900/30",
        icon: <ChevronRight className="w-6 h-6" />,
      };
  }
};

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const imageUrl = sessionStorage.getItem("burnImage");
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!imageUrl || !userId) {
      navigate("/");
      return;
    }

    const saved = sessionStorage.getItem("diagnosticoQuemadura");
    if (saved) {
      const result: DiagnosisResult = JSON.parse(saved);
      setDiagnosis(result);
    } else {
      navigate("/");
    }

    return () => {
      sessionStorage.removeItem("diagnosticoQuemadura");
      sessionStorage.removeItem("burnImage");
    };
  }, [imageUrl, navigate]);

  const handleNavigate = (ruta: string) => {
    sessionStorage.removeItem("diagnosticoQuemadura");
    sessionStorage.removeItem("burnImage");
    navigate(ruta);
  };

  const { color, bgColor, icon } = getColorAndIcon(diagnosis?.grado || "");

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-100 dark:from-zinc-900 dark:via-teal-950 dark:to-black flex flex-col items-center justify-center p-6">
        <div className="glassmorphism p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-teal-600 dark:text-teal-300">
            🎉 Diagnóstico Completo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-teal-50/50 dark:bg-teal-900/30 rounded-lg overflow-hidden shadow-md p-4 flex items-center justify-center">
              <img
                src={imageUrl!}
                alt="Imagen de Quemadura Analizada"
                className="max-h-56 max-w-full object-contain rounded-md shadow-md border border-teal-200/30 dark:border-teal-900/30"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div
                className={`p-4 rounded-lg flex items-center shadow-md ${bgColor}`}
              >
                <div className={`mr-3 ${color}`}>{icon}</div>
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Grado de Quemadura
                  </p>
                  <p className={`text-2xl font-bold ${color}`}>
                    {diagnosis?.grado || "Desconocido"}
                  </p>
                </div>
              </div>
              <div className="bg-teal-100/50 dark:bg-teal-900/30 p-4 rounded-lg flex items-center shadow-md">
                <span className="mr-3 text-teal-600 dark:text-teal-400 text-2xl">
                  📊
                </span>
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Confianza
                  </p>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {diagnosis?.confianza}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-zinc-800/50 rounded-xl shadow-md p-6 text-left mb-8 border border-teal-200/50 dark:border-teal-900/50">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <span className="mr-2 text-yellow-500 dark:text-yellow-300">
                💡
              </span>{" "}
              Recomendaciones
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {diagnosis?.recomendaciones || "Sin recomendaciones."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="uiverse-button"
              onClick={() => handleNavigate("/upload")}
            >
              <span className="mr-2">➕</span> Nueva Imagen
            </button>
            <button
              className="uiverse-button"
              onClick={() => handleNavigate("/history")}
            >
              <History className="mr-2 w-4 h-4" /> Historial
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultPage;
