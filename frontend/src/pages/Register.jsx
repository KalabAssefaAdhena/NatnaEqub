import { useState } from 'react';
import api from '../api/axios';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.firstName.trim()) newErrors.first_name = 'First name is required';
    if (!form.lastName.trim()) newErrors.last_name = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';
    if (!form.confirmPassword.trim())
      newErrors.confirm_password = 'Confirm password is required';
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    )
      newErrors.confirm_password = 'Passwords do not match';
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      setErrors(newErrors);
      return;
    }
    try {
      await api.post('/auth/register/', {
        username: form.username,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPassword,
      });
      setLoading(false);
      setForm({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setAlert({
        type: 'success',
        message:
          'Registration successful! Please check your email inbox and click the verification link to activate your account.',
      });
    } catch (err) {
      setLoading(false);
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setAlert({
          type: 'error',
          message: 'Error registering user. Please try again.',
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50">
      <div className="w-full max-w-md">
        <Card className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">
            Register
          </h2>

          {alert && (
            <div className="mb-4">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
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

            <div>
              <label className="block mb-1 font-medium text-gray-700">
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

            <div>
              <label className="block mb-1 font-medium text-gray-700">
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

          <Button
            variant="primary"
            onClick={handleRegister}
            className="w-full mt-6 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <Spinner size={20} className="inline-block" />
            ) : (
              'Register'
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}
