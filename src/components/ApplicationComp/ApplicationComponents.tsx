// src/components/ApplicationComp/ApplicationComponents.tsx
import React, { useState } from 'react';
import { type AppliedJob, type ApplicationStatus } from '../../services/ApplicationService';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  Eye, 
  Trash2, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  ExternalLink,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import Swal from 'sweetalert2';

// --- Enhanced Status Badge Component ---
const getStatusClasses = (status: ApplicationStatus): string => {
    switch (status) {
        case 'pending':
            return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200/50';
        case 'reviewed':
            return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200/50';
        case 'interview':
            return 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-200/50';
        case 'offered':
            return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200/50';
        case 'rejected':
            return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200/50';
        default:
            return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200/50';
    }
};

const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
        case 'pending':
            return <Clock size={14} />;
        case 'reviewed':
            return <Eye size={14} />;
        case 'interview':
            return <User size={14} />;
        case 'offered':
            return <CheckCircle size={14} />;
        case 'rejected':
            return <XCircle size={14} />;
        default:
            return <AlertCircle size={14} />;
    }
};

const getStatusText = (status: ApplicationStatus): string => {
    switch (status) {
        case 'pending':
            return 'Menunggu';
        case 'reviewed':
            return 'Ditinjau';
        case 'interview':
            return 'Wawancara';
        case 'offered':
            return 'Diterima';
        case 'rejected':
            return 'Ditolak';
        default:
            return status.charAt(0).toUpperCase() + status.slice(1);
    }
};

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
    return (
        <div className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-2xl transition-all duration-200 hover:scale-105 ${getStatusClasses(status)}`}>
            {getStatusIcon(status)}
            <span>{getStatusText(status)}</span>
        </div>
    );
};

// --- Enhanced Job Application Card Component ---
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
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, batalkan!',
      cancelButtonText: 'Jangan',
      customClass: { 
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setIsWithdrawing(true);
        onWithdraw(appliedJob.id, jobDetails?.title || 'lowongan ini');
      }
    });
  };

  const formatDate = (dateValue?: any): string => {
    if (!dateValue) return '-';

    if (typeof dateValue === 'object' && dateValue !== null && '_seconds' in dateValue) {
      const date = new Date(dateValue._seconds * 1000);
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    
    try {
      return new Date(dateValue).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch (e) {
      return 'Tanggal tidak valid';
    }
  };
  
  if (!jobDetails) {
    return (
      <div className="group relative bg-white backdrop-blur-sm border border-red-200/50 rounded-3xl overflow-hidden p-8 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-red-50/20"></div>
        <div className="relative text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20 mb-4">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <p className="text-sm text-red-600 font-medium">Detail pekerjaan untuk lamaran ini tidak dapat ditemukan (mungkin telah dihapus).</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white backdrop-blur-sm border border-gray-100/50 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 p-8 hover:shadow-purple-500/10 hover:border-purple-200/30">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-50/30 via-transparent to-indigo-50/20"></div>
      
      {/* Withdraw Button */}
      <button
        onClick={handleWithdrawClick}
        disabled={isWithdrawing}
        className="absolute top-6 right-6 w-12 h-12 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 group-hover:scale-110 shadow-lg z-10 bg-red-100 text-red-600 hover:bg-red-200 shadow-red-500/20"
        aria-label="Batalkan Lamaran"
      >
        {isWithdrawing ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto"></div>
        ) : (
          <Trash2 size={20} className="mx-auto" />
        )}
      </button>

      {/* Company Logo and Job Details */}
      <div className="relative flex items-start gap-6">
        {/* Enhanced Company Logo */}
        <div className="relative group/logo">
          <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-900/20 group-hover:shadow-xl group-hover:shadow-purple-900/25 transition-all duration-300 group-hover:scale-105">
            {jobDetails.companyLogo ? 
              <img src={jobDetails.companyLogo} alt={jobDetails.companyName} className="w-full h-full object-contain rounded-2xl"/> : 
              <span className="text-purple-700">{jobDetails.companyName.charAt(0).toUpperCase()}</span>
            }
          </div>
          {/* Pulse ring effect */}
          <div className="absolute inset-0 rounded-2xl bg-purple-900/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
        </div>

        <div className="flex-grow pr-20">
          {/* Job Title */}
          <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-purple-700 transition-colors duration-300">{jobDetails.title}</h3>
          
          {/* Job Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <Building2 size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{jobDetails.companyName}</p>
                <p className="text-xs text-gray-500">Perusahaan</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                <Calendar size={16} className="text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{formatDate(appliedJob.appliedAt)}</p>
                <p className="text-xs text-gray-500">Dilamar pada</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Status Section */}
      <div className="relative mt-6 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
            <TrendingUp size={14} className="text-green-600" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Status Lamaran</span>
        </div>
        <StatusBadge status={appliedJob.status} />
      </div>

      {/* Enhanced Action Buttons */}
      <div className="relative mt-8 pt-6 border-t border-gray-100">
        <div className="flex gap-3">
          <Link 
            to={`/jobdetail/${jobDetails.id}`} 
            className="group/link flex-1 bg-purple-900 hover:bg-purple-800 text-white px-6 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ExternalLink size={18} className="group-hover/link:rotate-12 transition-transform duration-200" />
            <span>Lihat Detail</span>
            <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-700"></div>
    </div>
  );
};

// --- Enhanced Application List Component ---
interface ApplicationListProps {
  appliedJobs: AppliedJob[];
  isLoading: boolean;
  error?: string | null;
  onWithdraw: (applicationId: string, jobTitle: string) => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({ appliedJobs, isLoading, error, onWithdraw }) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 animate-pulse">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
              <div className="flex-grow space-y-4">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-3/4"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-32"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-600 bg-red-50 rounded-3xl border border-red-200 shadow-lg">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20 mb-6">
          <AlertCircle size={24} className="text-red-600" />
        </div>
        <div className="text-lg font-semibold mb-2">Gagal Memuat Data</div>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (appliedJobs.length === 0) {
    return (
      <div className="text-center py-24 px-8 bg-white rounded-3xl shadow-lg border border-gray-100">
        {/* Enhanced empty state with gradient background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-pink-50/20 rounded-3xl"></div>
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-900/20 mb-6">
              <Briefcase size={40} className="text-purple-600" strokeWidth={1.5}/>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Belum Ada Lamaran</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Anda belum melamar pekerjaan apapun. Mulai jelajahi lowongan dan lamar pekerjaan impian Anda sekarang.
            </p>
            <Link 
              to="/jobsearch" 
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-900 to-purple-800 text-white font-semibold py-4 px-8 rounded-2xl hover:from-purple-800 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Cari Lowongan</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {appliedJobs.map(appliedJob => (
        <ApplicationJobCard key={appliedJob.id} appliedJob={appliedJob} onWithdraw={onWithdraw} />
      ))}
    </div>
  );
};