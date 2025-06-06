// src/pages/ApplicationPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ApplicationList } from '../components/ApplicationComp/ApplicationComponents';
import { getAppliedJobs, withdrawApplication, type AppliedJob } from '../services/ApplicationService';
import { Briefcase, Heart, Star, Sparkles, TrendingUp } from 'lucide-react';
import Swal from 'sweetalert2';

const ApplicationPage: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const jobs = await getAppliedJobs();
      setAppliedJobs(jobs);
    } catch (err: any) {
      console.error("Failed to fetch applied jobs:", err);
      setError(err.message || 'Gagal memuat lowongan yang dilamar.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleWithdrawApplication = async (applicationId: string, jobTitle: string) => {
    const originalJobs = [...appliedJobs];
    setAppliedJobs(prevJobs => prevJobs.filter(app => app.id !== applicationId));

    try {
      await withdrawApplication(applicationId);
      Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Lamaran untuk "${jobTitle}" dibatalkan`,
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          customClass: {
            popup: 'rounded-2xl'
          }
      });
    } catch (err: any) {
      setAppliedJobs(originalJobs);
      console.error("Failed to withdraw application:", err);
      Swal.fire({
        title: 'Gagal!',
        text: err.message || 'Gagal membatalkan lamaran.',
        icon: 'error',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50/30 flex flex-col">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            {/* Enhanced header with floating icons */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-400/80 rounded-2xl flex items-center justify-center animate-bounce delay-100">
                <TrendingUp size={16} className="text-green-800" />
              </div>
              <div className="absolute -top-2 -right-6 w-6 h-6 bg-pink-400/80 rounded-full flex items-center justify-center animate-bounce delay-300">
                <Heart size={12} className="text-pink-800 fill-current" />
              </div>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-purple-400/80 rounded-xl flex items-center justify-center animate-bounce delay-500">
                <Star size={14} className="text-purple-800 fill-current" />
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
                <Briefcase size={48} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Riwayat
              <span className="block bg-gradient-to-r from-green-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Lamaran
              </span>
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Lacak status dan kelola semua pekerjaan yang telah Anda lamar dalam perjalanan karir Anda
            </p>
            
            {/* Stats preview */}
            {!isLoading && !error && (
              <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">
                  {appliedJobs.length} lamaran aktif
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-20 text-blue-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 -mt-8 md:-mt-12 relative z-10">
        {/* Enhanced content section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
          <ApplicationList
            appliedJobs={appliedJobs}
            isLoading={isLoading}
            error={error}
            onWithdraw={handleWithdrawApplication}
          />
        </div>
        
        {/* Decorative elements */}
        {!isLoading && appliedJobs.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 text-gray-500">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <Sparkles size={16} className="text-purple-400" />
              <span className="text-sm font-medium">Terus semangat dalam perjalanan karir Anda!</span>
              <Sparkles size={16} className="text-indigo-400" />
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ApplicationPage;