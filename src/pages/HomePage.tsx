// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import HomepageContent from '../components/HomePageComp/HomepageContent'; 
import SectionAbout from '../components/HomePageComp/SectionAbout'; 
import SectionStats from '../components/HomePageComp/SectionStats'; 
import WhyJobmateSection from '../components/HomePageComp/WhyJobmateSection'; 
import LowonganTerbaru from "../components/HomePageComp/LowonganTerbaru"; 

import { fetchRecentJobs } from '../services/jobService';
import type { DisplayJob } from '../services/jobService';

// isLoggedIn prop tidak lagi dibutuhkan karena Navbar akan mengecek sendiri
// interface HomePageProps {
//   isLoggedIn: boolean; // Dihapus
// }

const HomePage: React.FC = () => { // Hapus isLoggedIn dari props
  const [recentJobs, setRecentJobs] = useState<DisplayJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const jobsFromApi = await fetchRecentJobs();
        setRecentJobs(jobsFromApi);
      } catch (err) {
        console.error("Error in HomePage fetching jobs:", err);
        setError("Gagal memuat lowongan kerja. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    getJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-blue-100 flex flex-col">
      {/* Navbar tidak lagi menerima prop isLoggedIn */}
      <Navbar /> 
      <main className="flex-grow pt-8 md:pt-12">
        <HomepageContent />
        <SectionAbout />
        <WhyJobmateSection />
        <SectionStats />

        {isLoading && (
          <div className="text-center py-10 text-gray-700">
            Memuat lowongan terbaru...
          </div>
        )}
        {error && (
          <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-md mx-auto max-w-lg">
            {error}
          </div>
        )}
        {!isLoading && !error && (
          <LowonganTerbaru
            showHeader={true}
            showButton={true}
            jobs={recentJobs}
            sectionTitle="Lowongan Kerja Terbaru Untukmu"
          />
        )}
        
        {/* Konten tambahan di HomePage tidak lagi bergantung pada prop isLoggedIn dari App.tsx. */}
        {/* Jika Anda ingin menampilkan konten berdasarkan status login di HomePage, */}
        {/* Anda bisa menambahkan listener onAuthStateChanged di HomePage juga */}
        {/* atau menggunakan React Context untuk berbagi status otentikasi. */}
        {/* Untuk saat ini, asumsikan konten HomePage adalah generik atau Navbar menangani semua UI terkait auth. */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
