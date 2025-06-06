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
        if (window.innerWidth >= 768) {
            setIsMobileMenuOpen(false);
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleLogout = () => {
    // PENAMBAHAN KONFIRMASI LOGOUT
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

  const NavLinks: React.FC<{isMobile?: boolean}> = ({ isMobile = false }) => (
    <>
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={isMobile ? "py-2" : "flex items-center hover:text-blue-600 transition-colors"}>Tentang JobMate</Link>
        <Link to="/jobsearch" onClick={() => setIsMobileMenuOpen(false)} className={isMobile ? "py-2" : "flex items-center hover:text-blue-600 transition-colors"}><Briefcase size={16} className="mr-1 inline-block md:hidden lg:inline-block"/> JobSearch</Link>
        <Link to="/companies" onClick={() => setIsMobileMenuOpen(false)} className={isMobile ? "py-2" : "flex items-center hover:text-blue-600 transition-colors"}><Building size={16} className="mr-1 inline-block md:hidden lg:inline-block"/> Perusahaan</Link>
        <button onClick={() => handleProtectedLink('/rekomendasi')} className={isMobile ? "py-2 text-left" : "flex items-center hover:text-blue-600 transition-colors"}><Sparkles size={16} className="mr-1 inline-block md:hidden lg:inline-block"/> Rekomendasi</button>
        <button onClick={() => handleProtectedLink('/cvreview')} className={isMobile ? "py-2 text-left" : "flex items-center hover:text-blue-600 transition-colors"}><FileSearch size={16} className="mr-1 inline-block md:hidden lg:inline-block"/> CV Review</button>
        
        {isMobile ? (
             <>
                <p className="py-2 font-semibold border-t border-gray-200 mt-2 pt-3">Layanan</p>
                <button onClick={() => handleProtectedLink('/services/jobchat')} className="py-2 pl-4 text-left">JobChat Mate Bot</button>
                <button onClick={() => handleProtectedLink('/services/ai-interview')} className="py-2 pl-4 text-left">AI Interview</button>
                <button onClick={() => handleProtectedLink('/services/jobmodul')} className="py-2 pl-4 text-left">JobModul</button>
             </>
        ) : (
          <div className="relative" ref={layananDropdownRef}>
            <button onClick={() => setIsLayananOpen(!isLayananOpen)} className="flex items-center hover:text-blue-600 transition-colors">
              Layanan <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isLayananOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLayananOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg text-sm p-2 z-10 border border-gray-100">
                <button onClick={() => handleProtectedLink('/services/jobchat')} className="w-full text-left block px-4 py-2 hover:bg-blue-50 rounded-md flex items-center"><Bot size={16} className="mr-2 text-blue-500"/>JobChat Mate Bot</button>
                <button onClick={() => handleProtectedLink('/services/ai-interview')} className="w-full text-left block px-4 py-2 hover:bg-blue-50 rounded-md flex items-center"><Mic2 size={16} className="mr-2 text-blue-500"/>AI Interview</button>
                <button onClick={() => handleProtectedLink('/services/jobmodul')} className="w-full text-left block px-4 py-2 hover:bg-blue-50 rounded-md flex items-center"><BookOpen size={16} className="mr-2 text-blue-500"/>JobModul</button>
              </div>
            )}
          </div>
        )}
        <button onClick={() => handleProtectedLink('/kerjasama')} className={isMobile ? "py-2 text-left" : "flex items-center hover:text-blue-600 transition-colors"}><Users size={16} className="mr-1 inline-block md:hidden lg:inline-block"/> Kerjasama</button>
    </>
  );

  if (isLoadingAuth) {
    return <header className="bg-white py-4 px-6 shadow-sm animate-pulse h-[76px]"></header>; 
  }

  return (
    <header className="bg-white py-4 px-6 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <div className="flex-shrink-0">
          <Link to="/" className="cursor-pointer">
            <img src="/logo.png" alt="JobMate Logo" className="h-12 md:h-15" onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/150x50/003366/FFFFFF?text=JobMate&font=roboto'; }}/>
          </Link>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center space-x-6 text-gray-700 font-medium text-sm">
            <NavLinks />
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn && currentUser ? (
            <>
              <button onClick={() => handleProtectedLink('/premium')} className="bg-yellow-400 text-white text-xs font-semibold px-3 py-2 rounded-md hover:bg-yellow-500 transition-colors shadow-sm">✨ Try Premium</button>
              <div className="relative" ref={profileDropdownRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <img src={currentUser.photoURL || `https://i.pravatar.cc/32?u=${currentUser.uid}`} alt="User Avatar" className="h-8 w-8 rounded-full object-cover border-2 border-blue-500" onError={(e) => {(e.target as HTMLImageElement).src='https://placehold.co/32x32/003366/FFFFFF?text=U&font=roboto';}}/>
                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 z-20 border">
                     <div className="px-4 py-2 border-b"><p className="text-sm font-medium text-gray-800 truncate">{currentUser.displayName || "Pengguna"}</p><p className="text-xs text-gray-500 truncate">{currentUser.email}</p></div>
                     <button onClick={() => handleProtectedLink('/profile/edit')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"><User className="mr-3 h-4 w-4 text-blue-500" />Edit Profile</button>
                     <button onClick={() => handleProtectedLink('/bookmarks')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"><Bookmark className="mr-3 h-4 w-4 text-blue-500" />Lowongan Tersimpan</button>
                     <button onClick={() => handleProtectedLink('/applications')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"><FileText className="mr-3 h-4 w-4 text-blue-500" />Lowongan Dilamar</button>
                     <div className="border-t my-1"></div>
                     <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="mr-3 h-4 w-4" />Log Out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3 text-sm font-medium">
              <Link to="/login" className="text-gray-800 hover:text-blue-600 px-4 py-2 rounded-md transition-colors hover:bg-gray-100">Masuk</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm">Daftar</Link>
            </div>
          )}
        </div>

        <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
                {isMobileMenuOpen ? <X size={24}/> : <Menu size={24} />}
            </button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full z-40">
             <div className="flex flex-col px-6 py-4 space-y-2 text-gray-700 font-medium">
                <NavLinks isMobile={true}/>
                <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
                    {isLoggedIn && currentUser ? (
                        <>
                           <button onClick={() => handleProtectedLink('/profile/edit')} className="w-full text-left flex items-center py-2"><User className="mr-3 h-4 w-4 text-blue-500" />Edit Profile</button>
                           <button onClick={() => handleProtectedLink('/bookmarks')} className="w-full text-left flex items-center py-2"><Bookmark className="mr-3 h-4 w-4 text-blue-500" />Lowongan Tersimpan</button>
                           <button onClick={() => handleProtectedLink('/applications')} className="w-full text-left flex items-center py-2"><FileText className="mr-3 h-4 w-4 text-blue-500" />Lowongan Dilamar</button>
                           <button onClick={() => handleProtectedLink('/premium')} className="w-full text-left bg-yellow-400 text-white px-3 py-2 rounded-md hover:bg-yellow-500 transition-colors shadow-sm">✨ Try Premium</button>
                           <div className="border-t my-1"></div>
                           <button onClick={handleLogout} className="w-full text-left flex items-center py-2 text-red-600"><LogOut className="mr-3 h-4 w-4" />Log Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-left block text-gray-800 py-2 rounded-md">Masuk</Link>
                            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-left block bg-blue-600 text-white px-4 py-2 rounded-md text-center">Daftar</Link>
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
