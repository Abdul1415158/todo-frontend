
import { useState } from "react";
import {useAuth} from "../context/AuthContext";
import API from '../services/api';
import { Link , useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await API.post("/login",{email,password});
            login(response.data.user, response.data.token);
            navigate('/dashboard')
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong")
        }
        finally{
            setLoading(false)
        }
    }
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 mb-4">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Log in to continue to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg">
                <span className="mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-slate-500 hover:text-slate-900 transition">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-slate-900 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login