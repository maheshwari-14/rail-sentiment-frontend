import { LogIn, Train } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAuth();

  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password, from);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="bg-orange-500 p-3 rounded-xl mb-4">
            <Train className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            RailSentiment
          </h2>
          <p className="mt-1 text-center text-sm text-gray-500">
            Indian Railway Tweet Sentiment Analysis
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Sign In</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Enter your credentials to access the dashboard
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
