// src/components/ApplicationComp/ApplicationComponents.tsx
import React, { useState } from 'react';
import { type AppliedJob, type ApplicationStatus } from '../../services/ApplicationService';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Calendar, Eye, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

// --- Status Badge Component ---
const getStatusClasses = (status: ApplicationStatus): string => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'reviewed':
            return 'bg-blue-100 text-blue-800';
        case 'interview':
            return 'bg-indigo-100 text-indigo-800';
        case 'offered':
            return 'bg-green-100 text-green-800';
        case 'rejected':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusClasses(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};


// --- Job Application Card Component ---
interface ApplicationJobCardProps {
  appliedJob: AppliedJob;
  onWithdraw: (applicationId: string, jobTitle: string) => void;
}

const ApplicationJobCard: React.FC<ApplicationJobCardProps> = ({ appliedJob, onWithdraw }) => {
  const { jobDetails } = appliedJob;
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdrawClick = () => {
    Swal.fire({
      title: 'Batalkan Lamaran?',
      text: `Anda yakin ingin membatalkan lamaran untuk posisi "${jobDetails?.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, batalkan!',
      cancelButtonText: 'Jangan',
      customClass: { popup: 'rounded-xl' }
    }).then((result) => {
      if (result.isConfirmed) {
        setIsWithdrawing(true);
        onWithdraw(appliedJob.id, jobDetails?.title || 'this job');
      }
    });
  };

  // PERBAIKAN DI SINI: Fungsi format tanggal yang lebih tangguh
  const formatDate = (dateValue?: any): string => {
    if (!dateValue) return '-';

    // Cek jika formatnya adalah objek timestamp dari API ({ _seconds, _nanoseconds })
    if (typeof dateValue === 'object' && dateValue !== null && '_seconds' in dateValue) {
      // Buat objek Date dari detik (abaikan nanodetik untuk display)
      const date = new Date(dateValue._seconds * 1000);
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    // Cek jika sudah menjadi objek Date (misalnya dari toDate() di service)
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    
    // Fallback jika formatnya adalah string tanggal
    try {
      return new Date(dateValue).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch (e) {
      return 'Tanggal tidak valid'; // Tampilkan pesan jika format tidak dikenali
    }
  };
  
  if (!jobDetails) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <p className="text-sm text-red-600">Detail pekerjaan untuk lamaran ini tidak dapat ditemukan (mungkin telah dihapus).</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start mb-3">
           <div className="flex-shrink-0 w-12 h-12 bg-blue-50 flex items-center justify-center rounded-lg">
                <span className="text-xl font-bold text-blue-600">
                    {jobDetails.companyName.charAt(0).toUpperCase()}
                </span>
           </div>
          <div className="flex-grow ml-4">
            <h3 className="text-md font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              <Link to={`/jobdetail/${jobDetails.id}`}>{jobDetails.title}</Link>
            </h3>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <Building2 size={14} className="mr-1.5"/>{jobDetails.companyName}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-gray-500 border-t pt-3 mt-3">
          <p className="flex items-center"><Calendar size={14} className="mr-2"/>Dilamar pada: {formatDate(appliedJob.appliedAt)}</p>
          <div className="flex items-center pt-2">
            <span className="mr-2 font-medium">Status:</span>
            <StatusBadge status={appliedJob.status} />
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t flex justify-end space-x-2">
         <Link 
            to={`/jobdetail/${jobDetails.id}`}
            className="p-2 text-sm text-blue-600 hover:bg-blue-100 rounded-md transition-colors flex items-center"
         >
            <Eye size={16} className="mr-1"/> Lihat Lowongan
         </Link>
         <button 
            onClick={handleWithdrawClick}
            disabled={isWithdrawing}
            className="p-2 text-sm text-red-600 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50 flex items-center"
         >
            {isWithdrawing ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-1"></div> : <Trash2 size={16} className="mr-1" />}
            Batalkan Lamaran
         </button>
      </div>
    </div>
  );
};


// --- Application List Component ---
interface ApplicationListProps {
  appliedJobs: AppliedJob[];
  isLoading: boolean;
  error?: string | null;
  onWithdraw: (applicationId: string, jobTitle: string) => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({ appliedJobs, isLoading, error, onWithdraw }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-gray-300 rounded-lg mr-4"></div>
              <div className="flex-grow">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 px-4 bg-red-50 text-red-700 rounded-lg shadow">
        <h3 className="font-semibold text-lg">Gagal Memuat Data</h3>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (appliedJobs.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md border border-gray-200">
        <Briefcase size={48} className="mx-auto text-gray-400" strokeWidth={1.5}/>
        <h3 className="mt-4 text-xl font-semibold text-gray-800">Anda Belum Melamar Pekerjaan Apapun</h3>
        <p className="mt-2 text-gray-500">Temukan pekerjaan impian Anda dan mulai melamar sekarang.</p>
        <Link 
            to="/jobsearch" 
            className="mt-6 inline-block bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition"
        >
            Cari Lowongan
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {appliedJobs.map(app => (
        <ApplicationJobCard key={app.id} appliedJob={app} onWithdraw={onWithdraw} />
      ))}
    </div>
  );
};
