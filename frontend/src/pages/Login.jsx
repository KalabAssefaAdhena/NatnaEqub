import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/token/', { username, password });

      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      const userRes = await api.get('/dashboard/');
      const user = userRes.data.user;

      if (user.is_superuser) navigate('/superuser');
      else navigate('/home');
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Login failed';
      setMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50">
      <div className="w-full max-w-md">
        <Card className="p-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">
            Login
          </h2>

          <div className="w-full space-y-4">
            <div className="w-full text-center">
              <label className="block mb-1 font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="w-full text-center">
              <label className="block mb-1 font-medium text-gray-700">
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

          <Button
            variant="primary"
            onClick={handleLogin}
            className="w-full mt-6 cursor-pointer"
            disabled={loading}
          >
            {loading ? <Spinner size={20} /> : 'Login'}
          </Button>

          {message && (
            <p className="mt-4 text-center font-medium text-red-600">
              {message}
            </p>
          )}

          <p className="mt-2 text-sm text-gray-600">
            <Link
              className="text-[var(--color-primary)] font-medium"
              to="/forgot-password"
            >
              Forgot Password?
            </Link>
          </p>

          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              className="text-[var(--color-primary)] font-medium"
              to="/register"
            >
              Register here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
