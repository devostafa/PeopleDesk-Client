import "./App.css";
import { Route, Routes } from "react-router";
import { useEffect } from "react";
import HomePage from "./view/pages/homePage.tsx";
import AdminPage from "./view/pages/adminPage.tsx";

function App() {
  // All the app's initialization functions are called here
  useEffect(() => {}, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
