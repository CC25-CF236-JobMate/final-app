// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import JobSearchPage from './pages/JobSearchPage';
import JobDetailPage from './pages/JobDetailPage';
import CvReviewPage from "./pages/CvReviewPage";
import ResumeAnalysisPage from "./pages/ResumeAnalysisPage";
import FillPendidikanPage from './pages/FillPendidikanPage';
import PengalamanFillPage from './pages/PengalamanFillPage';
import SkillFillPage from './pages/SkillFillPage';
import JobPreferPage from './pages/JobPreferPage';
import JobSearchStatusPage from './pages/JobSearchStatusPage';
import EditProfilePage from './pages/EditProfilePage';
import BookmarkPage from './pages/BookmarkPage';
import ApplicationPage from './pages/ApplicationsPage';
import RecommendPage from './pages/RecommendPage';
import CompaniesPage from './pages/CompanyPage';
import CompanyDetailPage from './pages/CompanyDetailPages';

import { auth } from './services/firebase'; 
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isLoggedIn, children }) => {
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// Komponen baru untuk halaman "Coming Soon"
const ComingSoon: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        Swal.fire({
            title: 'Fitur Segera Hadir!',
            text: 'Fitur ini sedang dalam tahap pengembangan dan akan segera tersedia untuk Anda. Terima kasih atas kesabaran Anda.',
            icon: 'info',
            confirmButtonText: 'Mengerti',
            customClass: { popup: 'rounded-xl' }
        }).then(() => {
            navigate(-1); // Kembali ke halaman sebelumnya
        });
    }, [navigate]);

    // Render placeholder sementara alert ditampilkan
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="text-center text-gray-600 dark:text-gray-400">
                <p>Mengarahkan...</p>
            </div>
        </div>
    );
};


function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false); 
      if (user) {
        const from = location.state?.from?.pathname || '/';
        if (window.location.pathname === '/login') {
          navigate(from, { replace: true });
        }
      }
    });
    return () => unsubscribe();
  }, [navigate, location.state]); 

  const isLoggedIn = !!currentUser;

  if (isLoadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-3 text-gray-700">Memuat aplikasi...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignUpPage />} />
      <Route path="/" element={<HomePage />} /> 
      <Route path="/jobsearch" element={<JobSearchPage />} />
      <Route path="/jobdetail/:id" element={<JobDetailPage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/companies/:id" element={<CompanyDetailPage />} />
      
      {/* Rute yang Dilindungi */}
      <Route path="/rekomendasi" element={<ProtectedRoute isLoggedIn={isLoggedIn}><RecommendPage /></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ApplicationPage /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute isLoggedIn={isLoggedIn}><BookmarkPage /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute isLoggedIn={isLoggedIn}><EditProfilePage /></ProtectedRoute>} />
      <Route path="/cvreview" element={<ProtectedRoute isLoggedIn={isLoggedIn}><CvReviewPage /></ProtectedRoute>} />
      <Route path="/resumeanalysis" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ResumeAnalysisPage /></ProtectedRoute>} />
      <Route path="/pendidikanfill" element={<ProtectedRoute isLoggedIn={isLoggedIn}><FillPendidikanPage /></ProtectedRoute>} />
      <Route path="/pengalamanfill" element={<ProtectedRoute isLoggedIn={isLoggedIn}><PengalamanFillPage /></ProtectedRoute>} />
      <Route path="/skillfill" element={<ProtectedRoute isLoggedIn={isLoggedIn}><SkillFillPage /></ProtectedRoute>} />
      <Route path="/jobpreferfill" element={<ProtectedRoute isLoggedIn={isLoggedIn}><JobPreferPage /></ProtectedRoute>} />
      <Route path="/jobstatus" element={<ProtectedRoute isLoggedIn={isLoggedIn}><JobSearchStatusPage /></ProtectedRoute>} />
      <Route path="/profile/saved-jobs" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Navigate to="/bookmarks" replace /></ProtectedRoute>} />
      <Route path="/profile/applied-jobs" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Navigate to="/applications" replace /></ProtectedRoute>} />

      {/* PERUBAHAN: Rute ini sekarang menampilkan alert "Coming Soon" */}
      <Route path="/services/jobchat" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ComingSoon /></ProtectedRoute>} />
      <Route path="/services/ai-interview" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ComingSoon /></ProtectedRoute>} />
      <Route path="/services/jobmodul" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ComingSoon /></ProtectedRoute>} />
      <Route path="/kerjasama" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ComingSoon /></ProtectedRoute>} />
      <Route path="/premium" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ComingSoon /></ProtectedRoute>} />

      <Route path="*" element={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <img src="https://placehold.co/300x200/FF6347/FFFFFF?text=404&font=montserrat" alt="404 Not Found" className="mb-4 rounded-lg shadow-md" />
          <h1 className="text-4xl font-bold text-gray-800">Oops! Halaman Tidak Ditemukan</h1>
          <p className="text-gray-600 mt-2">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
          <RouterLink to="/" className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Kembali ke Beranda
          </RouterLink>
        </div>
      } />
    </Routes>
  );
}

export default App;
