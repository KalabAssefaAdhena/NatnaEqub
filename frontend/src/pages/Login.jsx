import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("info");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/token/", { username, password });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      const userRes = await api.get("/dashboard/");
      const user = userRes.data.user;

      // ✅ success message (optional)
      setMessage("Login successful!");
      setMessageType("success");

      if (user.is_superuser) navigate("/superuser");
      else navigate("/home");
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Login failed";

      setMessage(detail);

      // ✅ always error here
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8 flex flex-col items-center">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)] text-center">
            Login
          </h2>

          {/* Inputs */}
          <div className="w-full space-y-4">
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className="w-full mb-4">
              <Alert
                type={messageType} // "error" | "success" | "info"
                message={message}
                onClose={() => setMessage("")}
              />
            </div>
          )}

          {/* Button */}
          <Button
            variant="primary"
            onClick={handleLogin}
            className="w-full mt-6 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <Spinner size={20} /> : "Login"}
          </Button>

          {/* Links */}
          <div className="mt-4 text-sm text-center space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              <Link
                className="text-[var(--color-primary)] font-medium hover:underline"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                className="text-[var(--color-primary)] font-medium hover:underline"
                to="/register"
              >
                Register here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
