// src/components/AuthComp/SignUpForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase'; // Pastikan path ini benar
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { User, Mail, Lock, Phone, MapPin, AtSign, AlertCircle } from 'lucide-react';

const SignUpForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [city, setCity] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Password dan konfirmasi password tidak cocok.");
            return;
        }

        if (username.length < 3 || /\s/.test(username)) {
            setError("Username minimal harus 3 karakter dan tidak boleh mengandung spasi.");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);
            const userPersonalInfoRef = doc(userDocRef, "user_personal", "info");

            await setDoc(userPersonalInfoRef, {
                username: username,
                fullName: fullName,
                email: email,
                phoneNumber: phoneNumber,
                city: city,
                address: "",
                photoUrl: "",
                github: "",
                instagram: "",
                linkedin: "",
                portfolioSite: "",
                status: "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            
            setLoading(false);

            // Tampilkan pilihan setelah berhasil mendaftar
            Swal.fire({
                title: 'Pendaftaran Berhasil!',
                text: 'Akun Anda telah berhasil dibuat. Apa yang ingin Anda lakukan selanjutnya?',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Lengkapi Profil Sekarang',
                cancelButtonText: 'Nanti Saja, ke Dashboard',
                confirmButtonColor: '#3B82F6',
                cancelButtonColor: '#6B7280',
                reverseButtons: true,
                allowOutsideClick: false, // Mencegah user menutup alert tanpa memilih
                customClass: { popup: 'rounded-xl' }
            }).then((result) => {
                if (result.isConfirmed) {
                    // PERUBAHAN DI SINI: Arahkan ke halaman Edit Profile
                    navigate('/profile/edit');
                } else {
                    // Arahkan ke halaman utama/dashboard
                    navigate('/');
                }
            });
            
        } catch (err: any) {
            console.error("Sign up error:", err.code, err.message);
            if (err.code === 'auth/email-already-in-use') {
                setError("Email sudah terdaftar. Silakan gunakan email lain atau login.");
            } else if (err.code === 'auth/weak-password') {
                setError("Kata sandi terlalu lemah. Gunakan minimal 6 karakter.");
            } else {
                setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
            }
            setLoading(false);
        }
    };


    return (
    <>
    <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-left mb-2">
        Buat Akun Baru
      </h1>
      <p className="text-gray-600 text-sm text-left mb-6">
        Mulai perjalanan karir Anda bersama JobMate!
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4 flex items-center" role="alert">
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          <span className="block sm:inline text-sm">{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" id="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ketik Nama Lengkap" required disabled={loading} className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div className="relative"><AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Min. 3 karakter, tanpa spasi" required disabled={loading} className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
          <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ketik Alamat Email" required disabled={loading} className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <div className="relative"><Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="tel" id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Nomor aktif" required disabled={loading} className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
              <div className="relative"><MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Contoh: Jakarta" required disabled={loading} className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
            </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 karakter" required disabled={loading} className="w-full pl-9 pr-10 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" minLength={6} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"><img src={showPassword ? '/pass-hide.png' : '/pass-reveal.png'} alt="Toggle" className="w-5 h-5"/></button></div>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
          <div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi password" required disabled={loading} className="w-full pl-9 pr-10 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" minLength={6}/><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"><img src={showConfirmPassword ? '/pass-hide.png' : '/pass-reveal.png'} alt="Toggle" className="w-5 h-5"/></button></div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-900 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed shadow-md flex items-center justify-center">
          {loading ? <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Mendaftarkan...</> : 'Daftar Sekarang'}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-6">
        Sudah Punya Akun?{' '}
        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Masuk
        </a>
      </p>
    </div>
    </>
  );
};

export default SignUpForm;
