import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {
  const [enabled, setEnabled] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [enabled]);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`
        relative w-16 h-9 flex items-center
        rounded-full p-1 transition-colors duration-300
        ${enabled ? "bg-zinc-800" : "bg-yellow-300"}
        shadow-inner
      `}
    >
      <div
        className={`
          absolute left-1 top-1 w-7 h-7
          rounded-full bg-white flex items-center justify-center
          transition-all duration-300
          ${enabled ? "translate-x-7 rotate-180" : ""}
        `}
      >
        {enabled ? (
          <Moon className="w-4 h-4 text-indigo-500" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default DarkModeToggle;
