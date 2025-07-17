import { useState } from "react";
import { MainNav } from "./main-nav";
import { Sidebar } from "./sidebar";
import "./app-layout.css";

export function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div
        className={`main-content ${
          !sidebarOpen ? "main-content-expanded" : ""
        }`}
      >
        <header className="app-header">
          <MainNav />
        </header>
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
