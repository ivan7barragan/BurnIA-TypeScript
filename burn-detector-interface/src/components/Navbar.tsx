import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import {
  ImageUp,
  MessageCircle,
  FileBarChart2,
  History,
  LogOut,
  X,
  SquareMenu,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const menuItems = [
    { to: "/UploadPage", label: "Subir Imagen", icon: <ImageUp size={18} /> },
    { to: "/chat", label: "Chat", icon: <MessageCircle size={18} /> },
    { to: "/result", label: "Resultado", icon: <FileBarChart2 size={18} /> },
    { to: "/history", label: "Historial", icon: <History size={18} /> },
  ];

  return (
    <>
      <style>{`
        .uiverse-button {
          background: linear-gradient(135deg, #e0f2f1, #c7eaea);
          color: #1f2937;
          border: 1px solid rgba(20, 184, 166, 0.3);
          border-radius: 8px;
          padding: 6px 12px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 0 8px rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .uiverse-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #14b8a6, #2dd4bf);
          color: white;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 16px rgba(20, 184, 166, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.25);
        }

        .uiverse-button:disabled {
          background: #d1d5db;
          color: #9ca3af;
          box-shadow: none;
          transform: none;
          cursor: not-allowed;
        }

        .uiverse-button.delete {
          background: linear-gradient(135deg, #f87171, #f1a9a9);
          color: white;
          border: 1px solid rgba(248, 113, 113, 0.3);
          padding: 6px;
        }

        .uiverse-button.delete:hover:not(:disabled) {
          background: linear-gradient(135deg, #ef4444, #f472b6);
          color: white;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.25);
        }

        .uiverse-button.delete::after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }

        .uiverse-button.delete:hover::after {
          width: 150px;
          height: 150px;
        }

        .glassmorphism-nav {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          border-left: 1px solid rgba(20, 184, 166, 0.1);
          border-right: 1px solid rgba(20, 184, 166, 0.1);
          overflow-x: hidden;
          padding: 0.5rem 1rem;
        }

        .dark .glassmorphism-nav {
          background: rgba(0, 0, 0, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          border-left: 1px solid rgba(20, 184, 166, 0.05);
          border-right: 1px solid rgba(20, 184, 166, 0.05);
        }

        .dark-mode-toggle {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 20px;
          transition: all 0.3s ease;
          margin-right: 0.5rem;
        }

        .dark .dark-mode-toggle {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .dark-mode-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
        }

        .nav-link {
          transition: all 0.3s ease;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 50%;
        }

        .nav-link:hover {
          color: #2dd4bf !important;
          transform: scale(1.05);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background: #2dd4bf;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .mobile-menu {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .nav-link {
            max-width: 70px;
          }
          .uiverse-button {
            padding: 4px 8px;
            font-size: 0.7rem;
          }
          .uiverse-button.delete {
            padding: 4px;
          }
          .uiverse-button.delete::after {
            width: 120px;
            height: 120px;
          }
          .glassmorphism-nav {
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
      <nav className="glassmorphism-nav px-3 sm:px-5 py-3 relative">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Izquierda: Botón menú mobile */}
          <div className="md:hidden flex items-center">
            <button
              className="text-zinc-800 dark:text-white hover:text-teal-500 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={18} /> : <SquareMenu size={18} />}
            </button>
          </div>

          {/* Centro: Nombre de la app */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-extrabold text-teal-600 dark:text-teal-300 text-shadow-sm whitespace-nowrap overflow-hidden text-ellipsis w-36 sm:w-44 mx-2">
            IA Quemaduras
          </div>

          {/* Derecha: Darkmode y logout */}
          <div className="flex items-center space-x-6 ml-auto mr-4">
            <div className="dark-mode-toggle">
              <DarkModeToggle />
            </div>
            <button onClick={handleLogout} className="uiverse-button delete">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Dropdown móvil */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 flex flex-col space-y-3 text-sm px-3 pb-2 bg-white/40 dark:bg-zinc-800/40 rounded-lg shadow-md border border-teal-200/30 dark:border-teal-900/30 mobile-menu">
            {menuItems.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className="nav-link flex items-center gap-1 text-zinc-700 dark:text-zinc-200 hover:text-teal-500"
                onClick={() => setIsMenuOpen(false)}
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Menú desktop */}
        <div className="hidden md:flex justify-center mt-3 space-x-6 text-sm">
          {menuItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="nav-link flex items-center gap-1 text-zinc-700 dark:text-zinc-200 hover:text-teal-500"
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
