import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Alert from "../components/Alert"; // import Alert

export default function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    try {
      await api.post("/auth/reset-password/", {
        uid,
        token,
        new_password: password,
      });
      setMessage("Password reset successful!");
      setMessageType("success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password");
      setMessageType("error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <Card className="p-6 flex flex-col items-center bg-white dark:bg-neutral-900 shadow-md rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">
            Reset Password
          </h2>

          <div className="w-full space-y-4">
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleReset}
            disabled={!password || !confirmPassword}
            className={`w-full mt-6 ${
              !password || !confirmPassword
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            Reset Password
          </Button>

          {message && (
            <div className="mt-4 w-full">
              <Alert
                type={messageType}
                message={message}
                onClose={() => setMessage("")}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
