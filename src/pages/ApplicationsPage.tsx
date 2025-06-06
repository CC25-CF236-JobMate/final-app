// src/pages/ApplicationPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ApplicationList } from '../components/ApplicationComp/ApplicationComponents';
import { getAppliedJobs, withdrawApplication, type AppliedJob } from '../services/ApplicationService';
import { Briefcase } from 'lucide-react';
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
    // Optimistic UI update: hapus dari daftar segera
    setAppliedJobs(prevJobs => prevJobs.filter(app => app.id !== applicationId));

    try {
      // Panggil API untuk menghapus
      await withdrawApplication(applicationId);
      Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Lamaran untuk "${jobTitle}" dibatalkan`,
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
      });
    } catch (err: any) {
      // Jika gagal, kembalikan state ke semula
      setAppliedJobs(originalJobs);
      console.error("Failed to withdraw application:", err);
       Swal.fire(
        'Gagal!',
        err.message || 'Gagal membatalkan lamaran.',
        'error'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
                <Briefcase size={32} className="mr-3 text-blue-600"/>
                Riwayat Lamaran
            </h1>
            <p className="mt-2 text-gray-600">Lacak status semua pekerjaan yang telah Anda lamar.</p>
        </div>
        
        <ApplicationList
          appliedJobs={appliedJobs}
          isLoading={isLoading}
          error={error}
          onWithdraw={handleWithdrawApplication}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ApplicationPage;
