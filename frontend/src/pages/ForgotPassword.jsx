import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert'; // import Alert

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // info, success, error
  const [loading, setLoading] = useState(false);

  const handleSendVerification = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/auth/resend-verification/', { username });
      setMessage(res.data.message || 'Email sent! Check your inbox.');
      setMessageType('success');
    } catch (err) {
      setMessage(
        err.response?.data?.message || 'Failed to send email. Try again later.'
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50">
      <div className="w-full max-w-md">
        <Card className="p-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">
            Forgot Password
          </h2>

          <p className="text-gray-700 mb-4 text-center">
            Enter your username to receive a password reset or verification
            email.
          </p>

          <div className="w-full mb-4 text-center">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleSendVerification}
            className="w-full cursor-pointer"
            disabled={loading || !username.trim()}
          >
            {loading ? <Spinner size={20} /> : 'Send Email'}
          </Button>

          {message && (
            <div className="mt-4 w-full">
              <Alert
                type={messageType}
                message={message}
                onClose={() => setMessage('')}
              />
            </div>
          )}

          <p className="mt-4 text-sm text-gray-600">
            Remembered your password?{' '}
            <Link className="text-[var(--color-primary)] font-medium" to="/">
              Login here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
