import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import {
  ImageUp,
  MessageCircle,
  FileBarChart2,
  History,
  LogOut,
  X,
  SquareMenu,
  Sun,
  Moon,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false); // Local state for theme animation

  const handleLogout = () => {
    localStorage.removeItem("userId");
    toast.success("Sesión cerrada correctamente.");
    navigate("/", { replace: true });
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const menuItems = [
    { to: "/UploadPage", label: "Subir Imagen", icon: ImageUp },
    { to: "/chat", label: "Chat", icon: MessageCircle },
    { to: "/result", label: "Resultado", icon: FileBarChart2 },
    { to: "/history", label: "Historial", icon: History },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

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
          position: relative;
          overflow: hidden;
          margin-right: 0.5rem;
        }

        .theme-toggle:hover {
          background: rgba(45, 212, 191, 0.1);
          transform: rotate(180deg) scale(1.1);
          box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.3);
        }

        .theme-toggle svg {
          transition: all 0.3s ease;
          color: #2dd4bf;
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

        .nav-link {
          transition: all 0.3s ease;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 50%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          color: #374151;
        }

        .dark .nav-link {
          color: #d1d5db;
        }

        .nav-link:hover {
          color: #2dd4bf !important;
          background: rgba(45, 212, 191, 0.1);
          transform: scale(1.02);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background: #2dd4bf;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .logout-button {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 8px 12px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: #374151;
          position: relative;
          overflow: hidden;
        }

        .dark .logout-button {
          color: #d1d5db;
        }

        .logout-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          transition: left 0.3s ease;
          z-index: -1;
        }

        .logout-button:hover::before {
          left: 0;
        }

        .logout-button:hover {
          color: white;
          border-color: #ef4444;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .mobile-menu {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          margin-top: 0.5rem;
          padding: 1rem;
        }

        .dark .mobile-menu {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hamburger {
          transition: all 0.3s ease;
          background: transparent;
          border: none;
          padding: 4px;
          border-radius: 4px;
          color: #374151;
        }

        .dark .hamburger {
          color: #d1d5db;
        }

        .hamburger:hover {
          background: rgba(45, 212, 191, 0.1);
          color: #2dd4bf;
          transform: rotate(90deg);
        }

        body {
          font-family: 'Inter', sans-serif;
        }

        @media (max-width: 640px) {
          .nav-link {
            max-width: 100%;
            justify-content: flex-start;
          }
          .glassmorphism-nav {
            padding: 0.5rem;
          }
        }
      `}</style>
      <nav
        className="glassmorphism-nav"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Mobile hamburger - Minimal with color change in dark mode */}
          <motion.button
            className="md:hidden hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X size={20} /> : <SquareMenu size={20} />}
          </motion.button>

          {/* Logo/Title - Centered */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-extrabold text-teal-600 dark:text-teal-300 whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Burn IA
          </motion.div>

          {/* Right: Theme toggle & Logout */}
          <div className="flex items-center space-x-2">
            <motion.button
              className="theme-toggle"
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={
                isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
              }
            >
              <Sun size={20} />
              <Moon size={20} />
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="logout-button text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Cerrar sesión"
            >
              <LogOut size={16} />
              Salir
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu - Original boxy dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {menuItems.map(({ to, label, icon: Icon }) => (
                <motion.div
                  key={to}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={to}
                    className="nav-link block text-zinc-700 dark:text-zinc-200 hover:text-teal-500 py-2"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label={`Navegar a ${label}`}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center mt-3 space-x-6">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <motion.div
              key={to}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={to}
                className="nav-link text-zinc-700 dark:text-zinc-200 hover:text-teal-500"
                aria-label={`Navegar a ${label}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
