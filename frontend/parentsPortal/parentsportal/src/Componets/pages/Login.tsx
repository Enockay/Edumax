import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context'; // Adjust the import based on your context file path
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner'; // Adjust the import based on your spinner file path

const LoginPage: React.FC = () => {
  const [admission, setAdmissionNumberInput] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error state before making request
    try {
      const response = await axios.post('https://edumax.fly.dev/parent/login', {
        admission,
        password,
      });
      const data = response.data;

      if (data.success) {
        const userName = data.message.fullName;
        login(userName!, admission);
        navigate('/'); // Redirect to the dashboard upon successful login
      } else {
        setError(data.message || 'Invalid admission number or password');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">Edumax Portal</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold">Admission Number</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={admission}
              onChange={(e) => setAdmissionNumberInput(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {loading && (
          <div className="flex justify-center mt-4">
            <Spinner />
          </div>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
