import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // <-- ESTA LÍNEA ES CLAVE
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
