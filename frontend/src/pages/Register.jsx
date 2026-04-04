import { useState } from "react";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrors({});
    setAlert(null);

    const newErrors = {};

    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.firstName.trim()) newErrors.first_name = "First name is required";
    if (!form.lastName.trim()) newErrors.last_name = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    if (!form.confirmPassword.trim())
      newErrors.confirm_password = "Confirm password is required";

    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      setErrors(newErrors);
      return;
    }

    try {
      await api.post("/auth/register/", {
        username: form.username,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPassword,
      });

      setForm({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setAlert({
        type: "success",
        message:
          "Registration successful! Please check your email and verify your account.",
      });
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setAlert({
          type: "error",
          message: "Error registering user. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8 text-center">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">
            Register
          </h2>

          {/* Alert */}
          {alert && (
            <div className="mb-4">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          {/* Form */}
          <div className="space-y-4 text-left">
            {/* Username */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <Input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <Input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirm_password}
                </p>
              )}
            </div>
          </div>

          {/* Button */}
          <Button
            variant="primary"
            onClick={handleRegister}
            className="w-full mt-6 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <Spinner size={20} /> : "Register"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
