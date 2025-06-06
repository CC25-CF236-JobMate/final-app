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
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-xl' }
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
      if (lower.includes('fulltime')) return 'bg-blue-100 text-blue-700';
      if (lower.includes('parttime')) return 'bg-purple-100 text-purple-700';
      if (lower.includes('freelance')) return 'bg-teal-100 text-teal-700';
      if (lower.includes('internship') || lower.includes('magang')) return 'bg-yellow-100 text-yellow-800';
      if (lower.includes('contract') || lower.includes('kontrak')) return 'bg-orange-100 text-orange-700';
      return 'bg-gray-100 text-gray-700';
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
    <div className="bg-white rounded-xl shadow border border-blue-100 p-6 relative hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div>
        <button
          onClick={handleRemoveClick}
          disabled={isRemoving}
          className="absolute top-3 right-3 p-1.5 rounded-full transition-colors duration-200 z-10 text-red-500 bg-red-100 hover:bg-red-200"
          aria-label="Hapus dari Bookmark"
        >
          {isRemoving ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : <Trash2 size={16} />}
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-blue-600">{jobDetails.companyName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight pr-8">{jobDetails.title}</h3>
            <div className="mt-1.5 space-y-1 text-xs">
              <p className="flex items-center text-gray-700">
                <Building2 size={14} className="mr-1.5 flex-shrink-0 text-gray-400"/>
                <span className="font-medium">{jobDetails.companyName}</span>
              </p>
              <p className="flex items-center text-gray-600">
                <MapPin size={14} className="mr-1.5 flex-shrink-0 text-gray-400"/> {jobDetails.location}
              </p>
              {formattedSalary && (
                <p className="flex items-center font-medium text-green-600">
                    <CircleDollarSign size={14} className="mr-1.5 flex-shrink-0 text-green-500"/> {formattedSalary}
                </p>
              )}
              <p className="flex items-center text-gray-600">
                <Clock size={14} className="mr-1.5 flex-shrink-0 text-gray-400"/> {postedText}
              </p>
            </div>
          </div>
        </div>
        
        {jobDetails.type && jobDetails.type.length > 0 && (
          <div className="mt-4"><div className="flex flex-wrap gap-1.5">
            {jobDetails.type.map((typeStr, index) => (
              <span key={index} className={`text-xs px-2.5 py-1 rounded-full font-medium ${getJobTypeTagClass(typeStr)}`}>{typeStr}</span>
            ))}
          </div></div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-gray-200">
          <Link to={`/jobdetail/${jobDetails.id}`} className="w-full text-sm border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200 font-medium text-center block">
            Lihat Detail
          </Link>
      </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-4"><div className="w-10 h-10 bg-gray-300 rounded-lg mr-4"></div><div className="w-2/3 h-5 bg-gray-300 rounded"></div></div>
            <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 px-4 bg-red-50 text-red-700 rounded-lg shadow"><h3 className="font-semibold text-lg">Gagal Memuat Data</h3><p className="mt-2">{error}</p></div>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md border border-gray-200">
        <BookmarkIcon size={48} className="mx-auto text-gray-400" strokeWidth={1.5}/>
        <h3 className="mt-4 text-xl font-semibold text-gray-800">Tidak Ada Lowongan Tersimpan</h3>
        <p className="mt-2 text-gray-500">Anda belum menyimpan lowongan pekerjaan apapun.</p>
        <Link to="/jobsearch" className="mt-6 inline-block bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition">
            Cari Lowongan
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map(bookmark => (
        <BookmarkJobCard key={bookmark.id} bookmark={bookmark} onRemoveBookmark={onRemoveBookmark} />
      ))}
    </div>
  );
};
