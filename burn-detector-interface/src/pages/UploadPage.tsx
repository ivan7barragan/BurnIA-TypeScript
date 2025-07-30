import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HelpGuide from "../components/HelpGuide";
import { ImagePlus, XCircle } from "lucide-react";

const UploadPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewUrl(base64);
      };
      reader.readAsDataURL(file); // convierte a base64
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = () => {
    if (!selectedImage) {
      alert("Por favor selecciona una imagen");
      return;
    }
    sessionStorage.setItem("burnImage", previewUrl || "");
    navigate("/chat");
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
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-100 dark:from-zinc-900 dark:via-teal-950 dark:to-black flex flex-col items-center justify-center p-6">
        <div className="glassmorphism p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-2xl space-y-6">
          <HelpGuide />
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-teal-600 dark:text-teal-300">
            Detector de Quemaduras
          </h1>
          <p className="text-center text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Sube una imagen para iniciar el diagnóstico
          </p>
          <div className="flex flex-col items-center space-y-4">
            <label
              htmlFor="upload-image"
              className={`cursor-pointer w-full flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300
                ${
                  previewUrl
                    ? "border-2 border-solid border-teal-500 bg-teal-50/50 dark:bg-teal-900/30"
                    : "border-2 border-dashed border-teal-400 bg-teal-50/30 dark:bg-zinc-800 hover:bg-teal-100/50 dark:hover:bg-zinc-700"
                }`}
              style={{ minHeight: "200px" }}
            >
              {previewUrl ? (
                <div className="flex flex-col items-center text-teal-600 dark:text-teal-300">
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    className="max-h-48 max-w-full object-contain rounded-md shadow-md border border-teal-200/30 dark:border-teal-900/30"
                  />
                  <span className="text-base font-semibold mt-2">
                    Imagen seleccionada
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      clearSelection();
                    }}
                    className="uiverse-button"
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Quitar imagen
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-teal-600 dark:text-teal-300">
                  <ImagePlus className="w-10 h-10 mb-2" />
                  <span className="text-base font-medium">
                    Selecciona o arrastra una imagen
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    PNG, JPG, JPEG (Max 5MB)
                  </span>
                </div>
              )}
            </label>
            <input
              id="upload-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedImage}
              className="uiverse-button"
            >
              <span className="mr-2">🚀</span> Enviar Imagen
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
