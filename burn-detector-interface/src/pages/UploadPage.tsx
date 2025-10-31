import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone"; // External lib: react-dropzone for drag-and-drop
import type { FileRejection } from "react-dropzone"; // Type-only import for FileRejection
import HelpGuide from "@/components/HelpGuide"; // Adjusted path based on your file tree
import { XCircle, UploadCloud } from "lucide-react"; // Removed unused ImagePlus

// Type for file validation
interface UploadFile extends File {
  preview?: string;
}

const UploadPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<UploadFile | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Loading state
  const navigate = useNavigate();

  // File validation
  const maxSize = 5 * 1024 * 1024; // 5MB
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setSelectedImage(fileWithPreview);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    maxFiles: 1,
    maxSize,
    onDropRejected: (fileRejections: FileRejection[]) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        alert("La imagen es demasiado grande. Máximo 5MB.");
      } else if (error?.code === "file-invalid-type") {
        alert("Solo se permiten imágenes PNG, JPG, JPEG.");
      } else {
        alert("Error al subir la imagen. Inténtalo de nuevo.");
      }
    },
  });

  const clearSelection = useCallback(() => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview); // Clean up memory
    }
    setSelectedImage(null);
  }, [selectedImage]);

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Por favor selecciona una imagen");
      return;
    }

    setIsUploading(true);
    try {
      // Convert to base64 for sessionStorage (smaller than blob URL)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        sessionStorage.setItem("burnImage", base64);
        navigate("/chat");
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      alert("Error al procesar la imagen. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (selectedImage?.preview) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    };
  }, [selectedImage]);

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

        .dropzone {
          border: 2px dashed rgba(20, 184, 166, 0.5);
          background: rgba(20, 184, 166, 0.05);
          transition: all 0.3s ease;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .dropzone:hover,
        .dropzone:focus {
          border-color: #14b8a6;
          background: rgba(20, 184, 166, 0.1);
        }

        .dropzone_active {
          border-color: #14b8a6;
          background: rgba(20, 184, 166, 0.15);
          transform: scale(1.02);
        }

        .dropzone_rejected {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .preview-image {
          max-height: 200px;
          max-width: 100%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }

        .preview-image:hover {
          transform: scale(1.02);
        }

        .uiverse-button {
          background: linear-gradient(45deg, #14b8a6, #0d9488);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 28px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1.1rem;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .uiverse-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(20, 184, 166, 0.4);
        }

        .uiverse-button:disabled {
          background: #d1d5db;
          color: #9ca3af;
          box-shadow: none;
          transform: none;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .clear-button {
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 0.9rem;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .clear-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        body {
          font-family: 'Inter', sans-serif;
        }

        /* Accessibility */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-100 dark:from-zinc-900 dark:via-teal-950 dark:to-black flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="glassmorphism p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-2xl space-y-6">
          <HelpGuide />
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-300">
              Detector de Quemaduras
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Sube una imagen clara de la quemadura para un diagnóstico preciso
              con IA
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div
              {...getRootProps()}
              className={`dropzone w-full rounded-xl transition-all duration-300 ${
                isDragActive
                  ? "dropzone_active"
                  : selectedImage
                  ? "bg-teal-50/50 dark:bg-teal-900/30 border-2 border-solid border-teal-500"
                  : ""
              }`}
              role="button"
              tabIndex={0}
              aria-label={
                selectedImage
                  ? "Cambiar imagen seleccionada"
                  : "Seleccionar o arrastrar imagen"
              }
            >
              <input {...getInputProps()} aria-hidden="true" />
              {selectedImage ? (
                <div className="flex flex-col items-center text-center text-teal-600 dark:text-teal-300 p-4">
                  <img
                    src={selectedImage.preview}
                    alt="Vista previa de la imagen seleccionada"
                    className="preview-image mb-3"
                    loading="lazy"
                  />
                  <span className="text-base font-semibold mb-2">
                    Imagen seleccionada: {selectedImage.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {Math.round(selectedImage.size / 1024)} KB
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearSelection();
                    }}
                    className="clear-button"
                    aria-label="Quitar imagen"
                  >
                    <XCircle className="w-4 h-4" />
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-teal-600 dark:text-teal-300">
                  <UploadCloud
                    className={`w-10 h-10 mb-2 ${
                      isDragActive ? "animate-bounce" : ""
                    }`}
                  />
                  <span className="text-base font-medium">
                    {isDragActive
                      ? "Suelta la imagen aquí"
                      : "Selecciona o arrastra una imagen"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    PNG, JPG, JPEG (Máx. 5MB) • Solo imágenes claras funcionan
                    mejor
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleSubmit}
              disabled={!selectedImage || isUploading}
              className="uiverse-button"
              aria-label="Enviar imagen para diagnóstico"
            >
              <span className="mr-2">{isUploading ? "⏳" : "🚀"}</span>
              {isUploading ? "Procesando..." : "Enviar Imagen"}
            </button>
          </div>

          {/* Optional: Tips section for better UX */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1 pt-4 border-t border-teal-200/30 dark:border-teal-800/30">
            <p>• Toma fotos con buena iluminación y enfoque en la quemadura</p>
            <p>
              • Este es un diagnóstico preliminar; consulta a un médico para
              tratamiento
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
