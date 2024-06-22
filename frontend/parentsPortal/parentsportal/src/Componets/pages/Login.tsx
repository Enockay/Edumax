import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context'; // Adjust the import based on your context file path
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner'; // Adjust the import based on your spinner file path
import Footer from '../Footer';

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
        const stream = data.message.stream;
        login(userName!, admission, stream);
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
      <div className="fixed bg-white p-8 rounded-lg shadow-md w-96 max-w-md ">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">Parent Portal</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4 mt-6">
            <label className="block mb-2 text-sm font-bold">Admission Number</label>
            <input
              type="text"
              className="w-80 p-2 border border-gray-300 rounded"
              value={admission}
              onChange={(e) => setAdmissionNumberInput(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 mt-6">
            <label className="block mb-2 text-sm font-bold">Password</label>
            <input
              type="password"
              className="w-80 p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <center>
          <button
            type="submit"
            className="w-32 bg-green-500 text-white p-2 rounded mt-5"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
            </center>
        </form>
        {loading && (
          <div className="flex justify-center mt-4">
            <Spinner />
          </div>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        <hr className='mt-10 bg-slate-800'></hr>
        <div>
         <p className='left-0 mt-4 text-center text-neutral-700 font-thin'>Edumax Systems by Blackie-networks</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
