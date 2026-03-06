import {
  BarChart2,
  LayoutDashboard,
  LogOut,
  Network,
  Train,
  Upload,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export default function Layout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-orange-500 p-2 rounded-md shadow-sm">
            <Train className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">RailSentiment</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/dashboard"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/upload"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/upload"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <Upload className="h-5 w-5" />
            Upload Dataset
          </Link>
          <Link
            to="/charts"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/charts"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            Sentiment Charts
          </Link>
          <Link
            to="/ontology"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/ontology"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <Network className="h-5 w-5" />
            Knowledge Graph
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
