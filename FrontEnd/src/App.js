import React, { useEffect } from "react";
import Dashboard from "./Components/dashboard";
import { Overview } from "./Components/overview.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/header";
import InitialPopup from "./Components/initialPopup.jsx";

function App() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <InitialPopup />
      {/* <MenuSection /> */}
      <Routes>
        <Route path="/" element={<Overview />} />
        {/* <Route path="/reports" element={<Reports />} /> */}
      </Routes>
    </main>
  );
}

export default App;
