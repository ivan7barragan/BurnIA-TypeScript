import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react"; // For theme toggle icons

// Unified modern styles
const customStyles = `
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

  .gradient-button {
    background: linear-gradient(45deg, #2dd4bf, #34d399);
    background-size: 200% 200%;
    animation: gradientAnimation 8s ease infinite;
    border-radius: 12px;
    padding: 12px 24px;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5;
    color: white;
    box-shadow: 0 4px 15px rgba(45, 212, 191, 0.3);
    transition: all 0.3s ease;
  }

  .gradient-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(45, 212, 191, 0.5);
    animation-play-state: paused;
  }

  .gradient-button:disabled {
    background: linear-gradient(45deg, #9ca3af, #d1d5db);
    cursor: not-allowed;
    box-shadow: none;
  }

  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .glow-input {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 10px 16px;
    color: #1f2937;
    transition: all 0.3s ease;
  }

  .dark .glow-input {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .glow-input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.3);
    border-color: #2dd4bf;
  }

  .hero-image {
    filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
    transition: transform 0.4s ease;
    max-width: 100%;
    height: auto;
    border-radius: 12px;
  }

  .hero-image:hover {
    transform: scale(1.05);
  }

  .theme-toggle {
    background: transparent;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    color: #2dd4bf;
  }

  .theme-toggle:hover {
    background: rgba(45, 212, 191, 0.1);
    transform: rotate(180deg) scale(1.1);
    box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.3);
  }

  .theme-toggle svg {
    transition: all 0.3s ease;
  }

  .dark .theme-toggle svg:first-child {
    opacity: 0;
    transform: scale(0.8);
  }

  .theme-toggle svg:last-child {
    position: absolute;
    opacity: 0;
    transform: scale(0.8);
  }

  .dark .theme-toggle svg:last-child {
    opacity: 1;
    transform: scale(1);
  }

  .tabs-list {
    background: transparent;
    border-bottom: 2px solid rgba(255, 255, 255, 0.15);
    margin-bottom: 1.5rem;
  }

  .tabs-trigger {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    padding: 10px 20px;
    transition: all 0.3s ease;
  }

  .tabs-trigger[data-state="active"] {
    color: #2dd4bf !important;
    border-bottom: 3px solid #2dd4bf !important;
  }

  .tabs-trigger:hover {
    color: #2dd4bf;
  }

  body {
    font-family: 'Inter', sans-serif;
  }
`;

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false); // Local state for theme toggle
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");

  // Theme toggle function (same as in Navbar)
  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/UploadPage");
    }
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registerPassword !== registerConfirm) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    try {
      const res = await fetch("http://10.0.20.50:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar");

      localStorage.setItem("userId", data.userId || data.id);

      toast.success("Cuenta creada correctamente.");
      setOpen(false);
      navigate("/UploadPage");
    } catch (err) {
      if (err instanceof Error) {
        toast.error("Registro fallido: " + err.message);
      } else {
        toast.error("Registro fallido: error desconocido");
      }
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://10.0.20.50:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error de login");

      localStorage.setItem("userId", data.userId || data.id);

      toast.success("Inicio de sesión exitoso");
      setOpen(false);
      navigate("/UploadPage");
    } catch (err) {
      if (err instanceof Error) {
        toast.error("Login fallido: " + err.message);
      } else {
        toast.error("Login fallido: error desconocido");
      }
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-100 dark:from-zinc-900 dark:via-teal-950 dark:to-black px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        {/* Theme Toggle Button (same as in Navbar) */}
        <button className="theme-toggle" onClick={toggleDarkMode}>
          <Sun size={20} />
          <Moon size={20} />
        </button>
        <div className="glassmorphism p-6 sm:p-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img
              src="/10281650.png"
              alt="Burn Diagnosis Icon"
              className="hero-image w-[clamp(120px,28vw,220px)] h-auto dark:invert"
            />
          </div>
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-800 dark:text-teal-200 leading-tight">
              Diagnóstico de Quemaduras{" "}
              <span className="text-teal-500">con IA</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-md mx-auto lg:mx-0">
              Analiza imágenes de quemaduras con nuestra IA avanzada y recibe
              recomendaciones médicas precisas en segundos.
            </p>
            <Button onClick={() => setOpen(true)} className="gradient-button">
              <span className="mr-2">🚑</span> Iniciar Diagnóstico
            </Button>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="glassmorphism p-6 rounded-2xl w-[90vw] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-teal-600 dark:text-teal-300 text-center">
                <span className="mr-2">👤</span> Acceso
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-gray-500 dark:text-gray-400">
                Inicia sesión o crea una cuenta para continuar con el
                diagnóstico.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="tabs-list grid grid-cols-2">
                <TabsTrigger value="login" className="tabs-trigger">
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger value="register" className="tabs-trigger">
                  Registrarse
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 dark:text-gray-200"
                    >
                      Correo
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      className="glow-input"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-gray-700 dark:text-gray-200"
                    >
                      Contraseña
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="glow-input"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full gradient-button">
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="new-email"
                      className="text-gray-700 dark:text-gray-200"
                    >
                      Correo
                    </Label>
                    <Input
                      id="new-email"
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      className="glow-input"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="new-password"
                      className="text-gray-700 dark:text-gray-200"
                    >
                      Contraseña
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="glow-input"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm"
                      className="text-gray-700 dark:text-gray-200"
                    >
                      Confirmar Contraseña
                    </Label>
                    <Input
                      id="confirm"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="glow-input"
                      value={registerConfirm}
                      onChange={(e) => setRegisterConfirm(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full gradient-button">
                    Crear Cuenta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default HomePage;
