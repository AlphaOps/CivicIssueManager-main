import { useState } from 'react';
import { Shield, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLoginFormProps {
  onBackToUserLogin: () => void;
}

export default function AdminLoginForm({ onBackToUserLogin }: AdminLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(username, password);
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-scaleIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-primary-900">Admin Login</h2>
        <p className="text-neutral-600 mt-2">Authorized personnel only</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Admin Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter admin username"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Signing in...' : 'Admin Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBackToUserLogin}
          className="text-primary hover:text-primary-700 font-medium transition-colors"
        >
          ← Back to User Login
        </button>
      </div>
    </div>
  );
}
