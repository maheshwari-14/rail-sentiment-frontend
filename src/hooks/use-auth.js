import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async (username, email, password) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Signup failed");
      }

      // Auto-redirect to login upon successful signup
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    setIsLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Incorrect username or password");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return { signup, login, logout, error, isLoading };
};
