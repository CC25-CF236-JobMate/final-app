// src/components/AuthComp/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase'; // Pastikan path ini benar

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Tambahkan useNavigate hook

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
        setError("Email dan password tidak boleh kosong.");
        setIsLoading(false);
        return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigasi setelah login berhasil akan dihandle oleh onAuthStateChanged di App.tsx
      // Jika Anda tetap ingin navigasi eksplisit setelah login di sini, Anda bisa uncomment baris di bawah
      // navigate('/'); 
    } catch (err: any) { // Penanganan error dari Firebase
      console.error("Firebase login error:", err.code, err.message);
      if (err.code === 'auth/user-not-found' || 
          err.code === 'auth/wrong-password' || 
          err.code === 'auth/invalid-credential') {
        setError('Email atau password yang Anda masukkan salah.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format email tidak valid. Silakan periksa kembali.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan login. Silakan coba lagi nanti atau reset password Anda.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
      }
      else {
        setError('Terjadi kesalahan saat mencoba login. Silakan coba beberapa saat lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md ">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-left mb-2">
        Selamat Datang Kembali!
      </h1>
      <p className="text-gray-600 text-sm text-left mb-8">
        Sign in untuk mengakses akunmu
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Alamat Email 
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Ketik email "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 ease-in-out"
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Ketik password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 ease-in-out"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-500 focus:outline-none p-1"
              disabled={isLoading}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              <img
                src={showPassword ? '/pass-hide.png' : '/pass-reveal.png'}
                alt="Toggle Password Visibility"
                className="w-5 h-5"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.style.display='none'; // Sembunyikan jika gambar gagal dimuat
                  // Atau ganti dengan teks
                  // target.parentElement?.insertAdjacentText('beforeend', showPassword ? 'Hide' : 'Show');
                }}
              />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Sign In'}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-8">
        Baru di JobMate?{' '}
        <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
          Daftar
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
