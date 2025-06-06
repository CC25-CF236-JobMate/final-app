// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Bookmark,
  FileText,
  LogOut,
  ChevronDown,
  Briefcase,
  FileSearch,
  Bot,
  Mic2,
  BookOpen,
  Users,
  Sparkles,
  Menu,
  X,
  Building,
} from 'lucide-react';
import { signOut, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLayananOpen, setIsLayananOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const layananDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (layananDropdownRef.current && !layananDropdownRef.current.contains(event.target as Node)) {
        setIsLayananOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) { // xl breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Apakah Anda yakin ingin keluar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await signOut(auth);
          setIsProfileOpen(false);
          setIsMobileMenuOpen(false);
          navigate('/');
        } catch (error) {
          console.error("Error logging out: ", error);
          Swal.fire({ title: 'Error!', text: 'Gagal logout, silakan coba lagi.', icon: 'error' });
        }
      }
    });
  };

  const handleProtectedLink = (path: string) => {
    setIsMobileMenuOpen(false);
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Akses Ditolak',
        html: 'Anda harus login terlebih dahulu untuk mengakses fitur ini.<br/>Silakan login untuk melanjutkan.',
        icon: 'warning',
        confirmButtonText: 'Login Sekarang',
        showCancelButton: true,
        cancelButtonText: 'Nanti Saja',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: path } });
        }
      });
    } else {
      navigate(path);
    }
  };

  const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <>
      <Link
        to="/"
        onClick={() => setIsMobileMenuOpen(false)}
        className={isMobile
          ? "py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-gray-700 hover:text-blue-700 font-medium"
          : "flex items-center px-4 py-2 rounded-xl hover:bg-white/60 backdrop-blur-sm text-gray-700 hover:text-blue-700 transition-all duration-300 font-medium hover:shadow-sm"
        }
      >
        Tentang JobMate
      </Link>

      <Link
        to="/jobsearch"
        onClick={() => setIsMobileMenuOpen(false)}
        className={isMobile
          ? "py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-gray-700 hover:text-blue-700 font-medium flex items-center"
          : "flex items-center px-4 py-2 rounded-xl hover:bg-white/60 backdrop-blur-sm text-gray-700 hover:text-blue-700 transition-all duration-300 font-medium hover:shadow-sm"
        }
      >
        <Briefcase size={16} className="mr-2 text-blue-600" />
        JobSearch
      </Link>

      <Link
        to="/companies"
        onClick={() => setIsMobileMenuOpen(false)}
        className={isMobile
          ? "py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-gray-700 hover:text-blue-700 font-medium flex items-center"
          : "flex items-center px-4 py-2 rounded-xl hover:bg-white/60 backdrop-blur-sm text-gray-700 hover:text-blue-700 transition-all duration-300 font-medium hover:shadow-sm"
        }
      >
        <Building size={16} className="mr-2 text-blue-600" />
        Perusahaan
      </Link>

      <button
        onClick={() => handleProtectedLink('/rekomendasi')}
        className={isMobile
          ? "py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-gray-700 hover:text-blue-700 font-medium text-left flex items-center w-full"
          : "flex items-center px-4 py-2 rounded-xl hover:bg-white/60 backdrop-blur-sm text-gray-700 hover:text-blue-700 transition-all duration-300 font-medium hover:shadow-sm"
        }
      >
        <Sparkles size={16} className="mr-2 text-purple-600" />
        Rekomendasi
      </button>

      <button
        onClick={() => handleProtectedLink('/cvreview')}
        className={isMobile
          ? "py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-gray-700 hover:text-blue-700 font-medium text-left flex items-center w-full"
          : "flex items-center px-4 py-2 rounded-xl hover:bg-white/60 backdrop-blur-sm text-gray-700 hover:text-blue-700 transition-all duration-300 font-medium hover:shadow-sm"
        }
      >
        <FileSearch size={16} className="mr-2 text-green-600" />
        CV Review
      </button>

      {isMobile ? (
        <>
          <button
            onClick={() => handleProtectedLink('/services/jobchat')}
            className="py-3 px-6 text-left flex items-center rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-gray-700 hover:text-blue-700 font-medium w-full"
          >
            <Bot size={16} className="mr-3 text-blue-500" />
            JobChat Mate Bot
          </button>
          <button
            onClick={() => handleProtectedLink('/services/ai-interview')}
            className="py-3 px-6 text-left flex items-center rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-gray-700 hover:text-blue-700 font-medium w-full"
          >
            <Mic2 size={16} className="mr-3 text-purple-500" />
            AI Interview
          </button>
          <button
            onClick={() => handleProtectedLink('/services/jobmodul')}
            className="py-3 px-6 text-left flex items-center rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-gray-700 hover:text-blue-700 font-medium w-full"
          >
            <BookOpen size={16} className="mr-3 text-indigo-500" />
            JobModul
          </button>
        </>
      ) : (
        <div className="relative" ref={layananDropdownRef}>
          <button
            onClick={() => setIsLayananOpen(!isLayananOpen)}
            className="flex items-center px-4 py-2 rounded-xl hover:bg-white/60 backdrop-blur-sm text-gray-700 hover:text-blue-700 transition-all duration-300 font-medium hover:shadow-sm"
          >
            Layanan
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${isLayananOpen ? 'rotate-180' : ''}`} />
          </button>
          {isLayananOpen && (
            <div className="absolute left-0 mt-3 w-64 bg-white/95 backdrop-blur-lg shadow-2xl shadow-blue-900/20 rounded-2xl border border-gray-200/50 p-3 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => handleProtectedLink('/services/jobchat')}
                className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-xl transition-all duration-300 flex items-center group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Bot size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">JobChat Mate Bot</p>
                  <p className="text-xs text-gray-500">AI Assistant untuk Karir</p>
                </div>
              </button>
              <button
                onClick={() => handleProtectedLink('/services/ai-interview')}
                className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 rounded-xl transition-all duration-300 flex items-center group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Mic2 size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">AI Interview</p>
                  <p className="text-xs text-gray-500">Simulasi Wawancara Kerja</p>
                </div>
              </button>
              <button
                onClick={() => handleProtectedLink('/services/jobmodul')}
                className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 rounded-xl transition-all duration-300 flex items-center group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <BookOpen size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">JobModul</p>
                  <p className="text-xs text-gray-500">Materi Pembelajaran Karir</p>
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => handleProtectedLink('/kerjasama')}
        className={isMobile
          ? "py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-gray-700 hover:text-blue-700 font-medium text-left flex items-center w-full"
          : "flex items-center px-4 py-2 rounded-xl hover:bg-white/60 backdrop-blur-sm text-gray-700 hover:text-blue-700 transition-all duration-300 font-medium hover:shadow-sm"
        }
      >
        <Users size={16} className="mr-2 text-orange-600" />
        Kerjasama
      </button>
    </>
  );

  if (isLoadingAuth) {
    return (
      <header className="bg-gradient-to-r from-blue-50 via-indigo-50/30 to-purple-50/50 backdrop-blur-sm py-4 px-6 shadow-lg border-b border-gray-200/50 animate-pulse h-[84px] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-blue-50 via-indigo-50/30 to-purple-50/50 backdrop-blur-sm py-4 px-6 shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      {/* Background Pattern - sama seperti JobSearch */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="cursor-pointer group">
            <img
              src="/logo.png"
              alt="JobMate Logo"
              className="h-12 md:h-14 transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/150x50/003366/FFFFFF?text=JobMate&font=roboto';
              }}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden xl:flex items-center space-x-2 text-gray-700 font-medium text-sm">
          <NavLinks />
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden xl:flex items-center space-x-4">
          {isLoggedIn && currentUser ? (
            <>


              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 cursor-pointer p-2 rounded-2xl hover:bg-white/60 backdrop-blur-sm transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50 hover:shadow-lg group"
                >
                  <img
                    src={currentUser.photoURL || `https://i.pravatar.cc/32?u=${currentUser.uid}`}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-xl object-cover border-2 border-blue-500 group-hover:border-blue-600 transition-colors duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/32x32/003366/FFFFFF?text=U&font=roboto';
                    }}
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-800 truncate max-w-32">
                      {currentUser.displayName || "Pengguna"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Profile
                    </p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl shadow-blue-900/20 py-4 z-20 border border-gray-200/50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Profile Header */}
                    <div className="px-6 py-3 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50 mx-4 rounded-xl mb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={currentUser.photoURL || `https://i.pravatar.cc/40?u=${currentUser.uid}`}
                          alt="User Avatar"
                          className="h-12 w-12 rounded-xl object-cover border-2 border-blue-500"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-800 truncate">
                            {currentUser.displayName || "Pengguna"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="px-2 space-y-1">
                      <button
                        onClick={() => handleProtectedLink('/profile/edit')}
                        className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-xl transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Edit Profile</span>
                      </button>

                      <button
                        onClick={() => handleProtectedLink('/bookmarks')}
                        className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-xl transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                          <Bookmark className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium">Lowongan Tersimpan</span>
                      </button>

                      <button
                        onClick={() => handleProtectedLink('/applications')}
                        className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 rounded-xl transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium">Lowongan Dilamar</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-200/50 mt-3 pt-2 px-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-medium">Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3 text-sm font-medium">
              <Link
                to="/login"
                className="text-gray-800 hover:text-blue-700 px-6 py-2.5 rounded-2xl transition-all duration-300 hover:bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:border-blue-300/50 hover:shadow-lg font-semibold"
              >
                Masuk
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-6 py-2.5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="xl:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-3 rounded-2xl text-gray-700 hover:bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white/95 backdrop-blur-lg shadow-2xl shadow-blue-900/20 absolute top-full left-0 w-full z-40 border-t border-gray-200/50">
          <div className="flex flex-col px-6 py-6 space-y-2 text-gray-700 font-medium max-h-screen overflow-y-auto">
            <NavLinks isMobile={true} />

            <div className="border-t border-gray-200/50 pt-4 mt-4 space-y-2">
              {isLoggedIn && currentUser ? (
                <>
                  {/* Mobile Profile Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={currentUser.photoURL || `https://i.pravatar.cc/40?u=${currentUser.uid}`}
                        alt="User Avatar"
                        className="h-12 w-12 rounded-xl object-cover border-2 border-blue-500"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {currentUser.displayName || "Pengguna"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleProtectedLink('/profile/edit')}
                    className="w-full text-left flex items-center py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 font-medium"
                  >
                    <User className="mr-3 h-5 w-5 text-blue-500" />
                    Edit Profile
                  </button>

                  <button
                    onClick={() => handleProtectedLink('/bookmarks')}
                    className="w-full text-left flex items-center py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 font-medium"
                  >
                    <Bookmark className="mr-3 h-5 w-5 text-green-500" />
                    Lowongan Tersimpan
                  </button>

                  <button
                    onClick={() => handleProtectedLink('/applications')}
                    className="w-full text-left flex items-center py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 font-medium"
                  >
                    <FileText className="mr-3 h-5 w-5 text-purple-500" />
                    Lowongan Dilamar
                  </button>


                  <div className="border-t border-gray-200/50 pt-3 mt-3">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center py-3 px-4 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all duration-300 font-medium"
                    >
                      <LogOut className="mr-3 h-5 w-5 text-red-500" />
                      Log Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-gray-700 hover:text-blue-700 font-medium"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-4 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;