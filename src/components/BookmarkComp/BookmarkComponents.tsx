// src/components/BookmarkComp/BookmarkComponents.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { type EnrichedBookmark } from '../../services/bookmarkService';
import { type DisplayJob } from '../../services/jobService';
import Swal from 'sweetalert2';
import { 
    MapPin, 
    Clock, 
    Building2,
    CircleDollarSign,
    Trash2,
    Bookmark as BookmarkIcon,
    ExternalLink,
    ArrowRight,
    Star,
    TrendingUp
} from 'lucide-react';

// --- Job Card Component ---
interface BookmarkJobCardProps {
  bookmark: EnrichedBookmark;
  onRemoveBookmark: (bookmarkId: string, jobTitle: string) => void;
}

const BookmarkJobCard: React.FC<BookmarkJobCardProps> = ({ bookmark, onRemoveBookmark }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const { jobDetails } = bookmark;

  if (!jobDetails) return null; // Should not happen if filtered in parent

  const handleRemoveClick = () => {
    Swal.fire({
      title: 'Hapus Lowongan?',
      text: `Anda yakin ingin menghapus "${jobDetails.title}" dari lowongan tersimpan?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: { 
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setIsRemoving(true);
        onRemoveBookmark(bookmark.id, jobDetails.title || 'lowongan ini');
      }
    });
  };

  const formatSalaryForCard = (salary?: DisplayJob['salary']): string | null => {
    if (!salary || typeof salary.min !== 'number' || typeof salary.max !== 'number') return null;
    const min = (salary.min / 1000000);
    const max = (salary.max / 1000000);
    const format = (val: number) => val % 1 === 0 ? val.toString() : val.toFixed(1);
    return `${salary.currency || 'IDR'} ${format(min)}jt - ${format(max)}jt`;
  };

  const getJobTypeTagClass = (type: string): string => {
      const lower = (type || '').toLowerCase().replace('-', '');
      if (lower.includes('fulltime')) return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200/50';
      if (lower.includes('parttime')) return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200/50';
      if (lower.includes('freelance')) return 'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 border border-teal-200/50';
      if (lower.includes('internship') || lower.includes('magang')) return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200/50';
      if (lower.includes('contract') || lower.includes('kontrak')) return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border border-orange-200/50';
      return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200/50';
  };
  
  const timeSince = (date?: Date): string => {
    if(!date) return '-';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " hari lalu";
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + " jam lalu";
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " menit lalu";
    return "Baru saja";
  }

  const postedText = jobDetails.posted || timeSince(jobDetails.postedDate);
  const formattedSalary = formatSalaryForCard(jobDetails.salary);

  return (
    <div className="group relative bg-white backdrop-blur-sm border border-gray-100/50 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 p-8 hover:shadow-blue-500/10 hover:border-blue-200/30">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20"></div>
      
      {/* Remove Bookmark Button */}
      <button
        onClick={handleRemoveClick}
        disabled={isRemoving}
        className="absolute top-6 right-6 w-12 h-12 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 group-hover:scale-110 shadow-lg z-10 bg-red-100 text-red-600 hover:bg-red-200 shadow-red-500/20"
        aria-label="Hapus dari Bookmark"
      >
        {isRemoving ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto"></div>
        ) : (
          <Trash2 size={20} className="mx-auto" />
        )}
      </button>

      {/* Company Logo and Job Details */}
      <div className="relative flex items-start gap-6">
        {/* Enhanced Company Logo */}
        <div className="relative group/logo">
          <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-900/20 group-hover:shadow-xl group-hover:shadow-blue-900/25 transition-all duration-300 group-hover:scale-105">
            {jobDetails.companyLogo ? 
              <img src={jobDetails.companyLogo} alt={jobDetails.companyName} className="w-full h-full object-contain rounded-2xl"/> : 
              <span className="text-blue-700">{jobDetails.companyName.charAt(0).toUpperCase()}</span>
            }
          </div>
          {/* Pulse ring effect */}
          <div className="absolute inset-0 rounded-2xl bg-blue-900/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
        </div>

        <div className="flex-grow pr-20">
          {/* Job Title */}
          <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-blue-700 transition-colors duration-300">{jobDetails.title}</h3>
          
          {/* Job Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Building2 size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{jobDetails.companyName}</p>
                <p className="text-xs text-gray-500">Perusahaan</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <MapPin size={16} className="text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{jobDetails.location}</p>
                <p className="text-xs text-gray-500">Lokasi</p>
              </div>
            </div>
            
            {formattedSalary && (
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <CircleDollarSign size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-green-600">{formattedSalary}</p>
                  <p className="text-xs text-gray-500">Gaji</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <Clock size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{postedText}</p>
                <p className="text-xs text-gray-500">Dipublikasi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Job Type Tags */}
      {jobDetails.type && jobDetails.type.length > 0 && (
        <div className="relative mt-6 mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
              <TrendingUp size={14} className="text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Tipe Pekerjaan</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {jobDetails.type.map((typeStr, index) => (
              <span key={index} className={`text-sm px-4 py-2 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 ${getJobTypeTagClass(typeStr)}`}>
                {typeStr}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Skills Tags */}
      {jobDetails.skillsRequired && jobDetails.skillsRequired.length > 0 && (
        <div className="relative mt-6 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-100 to-sky-200 rounded-lg flex items-center justify-center">
              <Star size={14} className="text-sky-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Keahlian Dibutuhkan</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {jobDetails.skillsRequired.slice(0, 5).map((skill, index) => (
              <span key={index} className="bg-gradient-to-r from-sky-100 to-sky-200 text-sky-700 text-sm px-4 py-2 rounded-2xl font-semibold border border-sky-200/50 transition-all duration-200 hover:scale-105">
                {skill}
              </span>
            ))}
            {jobDetails.skillsRequired.length > 5 && (
              <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-sm px-4 py-2 rounded-2xl font-semibold border border-gray-200/50">
                +{jobDetails.skillsRequired.length - 5} lainnya
              </span>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Action Button */}
      <div className="relative mt-8 pt-6 border-t border-gray-100">
        <Link 
          to={`/jobdetail/${jobDetails.id}`} 
          className="group/link w-full bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ExternalLink size={18} className="group-hover/link:rotate-12 transition-transform duration-200" />
          <span>Lihat Detail</span>
          <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700"></div>
    </div>
  );
};

// --- Bookmark List Component ---
interface BookmarkListProps {
  bookmarks: EnrichedBookmark[];
  isLoading: boolean;
  error?: string | null;
  onRemoveBookmark: (bookmarkId: string, jobTitle: string) => void;
}

export const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, isLoading, error, onRemoveBookmark }) => {
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
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-20"></div>
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-24"></div>
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
      <div className="text-center py-16 text-red-600 bg-red-50 rounded-2xl border border-red-200 mx-4">
        <div className="text-lg font-semibold mb-2">Gagal Memuat Data</div>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-24 px-8 bg-white rounded-3xl shadow-lg border border-gray-100">
        {/* Enhanced empty state with gradient background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 rounded-3xl"></div>
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-900/20 mb-6">
              <BookmarkIcon size={40} className="text-blue-600" strokeWidth={1.5}/>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Tidak Ada Lowongan Tersimpan</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Anda belum menyimpan lowongan pekerjaan apapun. Mulai jelajahi dan simpan lowongan yang menarik untuk Anda.
            </p>
            <Link 
              to="/jobsearch" 
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-semibold py-4 px-8 rounded-2xl hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
      {bookmarks.map(bookmark => (
        <BookmarkJobCard key={bookmark.id} bookmark={bookmark} onRemoveBookmark={onRemoveBookmark} />
      ))}
    </div>
  );
};