// src/components/Lowongan.tsx
import React, { useState, useEffect } from 'react';
import type { DisplayJob } from '../../services/jobService'; 
import { Link } from 'react-router-dom';
import { Bookmark, ExternalLink, MapPin, Clock, Building2, CircleDollarSign, CheckCircle } from 'lucide-react'; 
import { auth } from '../../services/firebase';
import { addBookmark, removeBookmarkByJobId, getBookmarks } from '../../services/bookmarkService';
import { getApplications } from '../../services/ApplicationService'; // Impor fungsi untuk get lamaran
import Swal from 'sweetalert2';
import ApplyJobModal from '../Modal/ApplyJob';

interface LowonganProps {
  jobs: DisplayJob[];
  isLoading?: boolean;
  error?: string | null;
}

const formatSalaryForCard = (salary?: DisplayJob['salary']): string | null => {
  if (!salary || typeof salary.min !== 'number' || typeof salary.max !== 'number') {
    return null;
  }
  const minSalaryShort = (salary.min / 1000000);
  const maxSalaryShort = (salary.max / 1000000);
  const formatMillions = (val: number) => val % 1 === 0 ? val.toString() : val.toFixed(1);
  return `${salary.currency || 'IDR'} ${formatMillions(minSalaryShort)}jt - ${formatMillions(maxSalaryShort)}jt`;
};

const getJobTypeTagClass = (type: string): string => {
    const lowerType = (type || '').toLowerCase().replace('-', '');
    if (lowerType.includes('fulltime')) return 'bg-blue-100 text-blue-700';
    if (lowerType.includes('parttime')) return 'bg-purple-100 text-purple-700';
    if (lowerType.includes('freelance')) return 'bg-teal-100 text-teal-700';
    if (lowerType.includes('internship') || lowerType.includes('magang')) return 'bg-yellow-100 text-yellow-800';
    if (lowerType.includes('contract') || lowerType.includes('kontrak')) return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
};

const Lowongan: React.FC<LowonganProps> = ({ jobs, isLoading, error }) => {
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [togglingBookmarkId, setTogglingBookmarkId] = useState<string | null>(null);
  const [applyingJob, setApplyingJob] = useState<DisplayJob | null>(null);

  useEffect(() => {
    // Fetch data bookmark dan lamaran saat komponen dimuat
    if (auth.currentUser && jobs.length > 0) {
        getBookmarks()
            .then(bookmarks => {
                setBookmarkedJobIds(new Set(bookmarks.map(b => b.jobId)));
            })
            .catch(err => console.error("Failed to fetch initial bookmarks:", err));
        
        getApplications()
            .then(applications => {
                setAppliedJobIds(new Set(applications.map(app => app.jobId)));
            })
            .catch(err => console.error("Failed to fetch initial applications:", err));
    }
  }, [jobs]);

  const toggleBookmark = async (jobId: string) => {
    if (!auth.currentUser) {
        Swal.fire('Akses Ditolak', 'Anda harus login untuk menyimpan lowongan.', 'warning');
        return;
    }
    setTogglingBookmarkId(jobId);
    const isCurrentlyBookmarked = bookmarkedJobIds.has(jobId);
    try {
        if (isCurrentlyBookmarked) {
            await removeBookmarkByJobId(jobId);
            setBookmarkedJobIds(prev => { const newSet = new Set(prev); newSet.delete(jobId); return newSet; });
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Bookmark dihapus', showConfirmButton: false, timer: 1500 });
        } else {
            await addBookmark(jobId);
            setBookmarkedJobIds(prev => { const newSet = new Set(prev); newSet.add(jobId); return newSet; });
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Lowongan disimpan', showConfirmButton: false, timer: 1500 });
        }
    } catch (err: any) {
        Swal.fire('Error', err.message || 'Gagal memproses bookmark.', 'error');
    } finally {
        setTogglingBookmarkId(null);
    }
  };

  const handleQuickApplyClick = (job: DisplayJob) => {
    if (!auth.currentUser) {
        Swal.fire('Akses Ditolak', 'Anda harus login untuk melamar pekerjaan.', 'warning');
        return;
    }
    setApplyingJob(job);
  };

  const handleApplySuccess = () => {
    if (applyingJob) {
        setAppliedJobIds(prev => new Set(prev).add(applyingJob.id));
        Swal.fire({
            title: 'Lamaran Terkirim!',
            text: `Lamaran Anda untuk posisi ${applyingJob.title} telah berhasil dikirim.`,
            icon: 'success',
            confirmButtonText: 'Luar Biasa!',
        });
        setApplyingJob(null);
    }
  };

  if (isLoading) return <div className="text-center py-10 text-gray-700">Memuat lowongan...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!jobs || jobs.length === 0) return <div className="text-center py-10 text-gray-600">Tidak ada lowongan yang ditemukan.</div>;

  return (
    <>
      <div className="space-y-6">
        {jobs.map((job) => {
          const isBookmarked = bookmarkedJobIds.has(job.id);
          const isApplied = appliedJobIds.has(job.id);
          const formattedSalary = formatSalaryForCard(job.salary);
          const isToggling = togglingBookmarkId === job.id;

          return (
            <div 
              key={job.id} 
              className={`bg-white rounded-xl shadow border p-6 relative hover:shadow-md transition-shadow duration-200
                ${isApplied ? 'border-green-400 bg-green-50/50' : 'border-blue-100'}`}
            >
              <button
                onClick={() => toggleBookmark(job.id)}
                disabled={isToggling || isApplied}
                className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors duration-200 z-10 disabled:cursor-not-allowed disabled:opacity-60
                  ${isBookmarked ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'text-gray-400 hover:text-blue-500 hover:bg-gray-100'}`}
                aria-label={isBookmarked ? "Hapus dari Bookmark" : "Tambahkan ke Bookmark"}
              >
                {isToggling ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />}
              </button>

              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl font-semibold flex-shrink-0">
                    {job.companyLogo ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain rounded-lg"/> : job.companyName.charAt(0).toUpperCase()}
                 </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight pr-6">{job.title}</h3>
                  <div className="mt-1.5 space-y-1 text-xs">
                    <p className="flex items-center text-gray-700"><Building2 size={14} className="mr-1.5"/> <span className="font-medium">{job.companyName}</span></p>
                    <p className="flex items-center text-gray-600"><MapPin size={14} className="mr-1.5"/> {job.location}</p>
                    {formattedSalary && <p className="flex items-center font-medium text-green-600"><CircleDollarSign size={14} className="mr-1.5"/> {formattedSalary}</p>}
                    <p className="flex items-center text-gray-600"><Clock size={14} className="mr-1.5"/> {job.posted}</p>
                  </div>
                </div>
              </div>
              
              {job.type && job.type.length > 0 && <div className="mt-3"><div className="flex flex-wrap gap-1.5">{job.type.map((typeStr, index) => <span key={index} className={`text-xs px-2.5 py-1 rounded-full font-medium ${getJobTypeTagClass(typeStr)}`}>{typeStr}</span>)}</div></div>}
              {job.skillsRequired && job.skillsRequired.length > 0 && <div className="mt-3"><div className="flex flex-wrap gap-1.5">{job.skillsRequired.slice(0, 5).map((skill, index) => <span key={index} className="bg-sky-100 text-sky-700 text-xs px-2.5 py-1 rounded-full font-medium">{skill}</span>)}{job.skillsRequired.length > 5 && <span className="bg-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">+{job.skillsRequired.length - 5} lainnya</span>}</div></div>}

              <hr className="my-4 border-t border-gray-200" />
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {isApplied ? (
                    <div className="w-full flex-grow text-sm bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
                        <CheckCircle size={16} /> Terlamar
                    </div>
                ) : (
                    <button onClick={() => handleQuickApplyClick(job)} className="w-full sm:w-auto flex-grow text-sm bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2">
                        <ExternalLink size={16} /> Lamar Cepat
                    </button>
                )}
                <Link to={`/jobdetail/${job.id}`} className={`w-full sm:w-auto flex-grow text-sm border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition font-medium text-center ${isApplied ? 'pointer-events-none opacity-60' : ''}`}>
                  Lihat Detail
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      {applyingJob && (
          <ApplyJobModal
              jobId={applyingJob.id}
              jobTitle={applyingJob.title}
              companyName={applyingJob.companyName}
              onClose={() => setApplyingJob(null)}
              onApplySuccess={handleApplySuccess}
          />
      )}
    </>
  );
};

export default Lowongan;
