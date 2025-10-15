import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import Button from '../components/Button';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}/`);
        const msg = response.data.message.toLowerCase();

        if (msg.includes('already verified')) {
          setStatus('info');
        } else {
          setStatus('success');
        }

        setMessage(response.data.message);
      } catch (err) {
        setStatus('error');
        if (err.response?.data?.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage('Verification failed. Please try again.');
        }
      }
    };

    verifyEmail();
  }, [token]);

  const getTextColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'info':
        return 'text-blue-600';
      case 'error':
      default:
        return 'text-red-600';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50">
      <div className="w-full max-w-md">
        <Card className="text-center p-6">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">
            Email Verification
          </h2>

          {status === 'loading' && <Spinner size={40} className="mx-auto" />}

          {status !== 'loading' && (
            <>
              <p className={`text-lg mb-4 ${getTextColor()}`}>{message}</p>
              <Button
                variant="primary"
                onClick={() => navigate('/')}
                className="mt-4"
              >
                Go to Login
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
