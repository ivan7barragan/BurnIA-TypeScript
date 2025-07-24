import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import ChatPage from "./pages/ChatPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import PrivateRouteLayout from "./components/PrivateRouteLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/UploadPage"
          element={
            <PrivateRouteLayout>
              <UploadPage />
            </PrivateRouteLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRouteLayout>
              <ChatPage />
            </PrivateRouteLayout>
          }
        />
        <Route
          path="/result"
          element={
            <PrivateRouteLayout>
              <ResultPage />
            </PrivateRouteLayout>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRouteLayout>
              <HistoryPage />
            </PrivateRouteLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
