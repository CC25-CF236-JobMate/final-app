// src/components/Lowongan.tsx
import React, { useState, useEffect } from 'react';
import type { DisplayJob } from '../../services/jobService'; 
import { Link } from 'react-router-dom';
import { Bookmark, ExternalLink, MapPin, Clock, Building2, CircleDollarSign, CheckCircle, TrendingUp, ArrowRight, Star } from 'lucide-react'; 
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
    if (lowerType.includes('fulltime')) return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200/50';
    if (lowerType.includes('parttime')) return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200/50';
    if (lowerType.includes('freelance')) return 'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 border border-teal-200/50';
    if (lowerType.includes('internship') || lowerType.includes('magang')) return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200/50';
    if (lowerType.includes('contract') || lowerType.includes('kontrak')) return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border border-orange-200/50';
    return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200/50';
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

  if (isLoading) return <div className="text-center py-16 text-gray-700"><div className="inline-flex items-center space-x-2"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div><span className="text-lg font-medium">Memuat lowongan...</span></div></div>;
  if (error) return <div className="text-center py-16 text-red-600 bg-red-50 rounded-2xl border border-red-200 mx-4"><div className="text-lg font-semibold">{error}</div></div>;
  if (!jobs || jobs.length === 0) return <div className="text-center py-16 text-gray-600 bg-gray-50 rounded-2xl border border-gray-200 mx-4"><div className="text-lg font-medium">Tidak ada lowongan yang ditemukan.</div></div>;

  return (
    <>
      <div className="space-y-8">
        {jobs.map((job) => {
          const isBookmarked = bookmarkedJobIds.has(job.id);
          const isApplied = appliedJobIds.has(job.id);
          const formattedSalary = formatSalaryForCard(job.salary);
          const isToggling = togglingBookmarkId === job.id;

          return (
            <div 
              key={job.id} 
              className={`group relative bg-white backdrop-blur-sm border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 p-8
                ${isApplied ? 'border-green-200/50 bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20 hover:shadow-green-500/10' : 'border-gray-100/50 hover:shadow-blue-500/10 hover:border-blue-200/30'}`}
            >
              {/* Gradient Background Overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isApplied ? 'bg-gradient-to-br from-green-50/40 via-transparent to-emerald-50/30' : 'bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20'}`}></div>
              
              {/* Top Right Section - Bookmark Only */}
              <div className="absolute top-6 right-6 flex flex-col items-end space-y-3 z-10">
                {/* Enhanced Bookmark Button */}
                <button
                  onClick={() => toggleBookmark(job.id)}
                  disabled={isToggling || isApplied}
                  className={`w-12 h-12 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 group-hover:scale-110 shadow-lg ${isBookmarked ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-blue-500/20' : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 border border-gray-200/50'}`}
                  aria-label={isBookmarked ? "Hapus dari Bookmark" : "Tambahkan ke Bookmark"}
                >
                  {isToggling ? 
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto"></div> : 
                    <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} className="mx-auto" />
                  }
                </button>
              </div>

              <div className="relative flex items-start gap-6">
                {/* Enhanced Company Logo */}
                <div className="relative group/logo">
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-900/20 group-hover:shadow-xl group-hover:shadow-blue-900/25 transition-all duration-300 group-hover:scale-105">
                    {job.companyLogo ? 
                      <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain rounded-2xl"/> : 
                      <span className="text-blue-700">{job.companyName.charAt(0).toUpperCase()}</span>
                    }
                  </div>
                  {/* Pulse ring effect */}
                  <div className="absolute inset-0 rounded-2xl bg-blue-900/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
                </div>

                <div className="flex-grow pr-16"> {/* Reduced right padding since no badge */}
                  {/* Job Title */}
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-blue-700 transition-colors duration-300">{job.title}</h3>
                  
                  {/* Job Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <Building2 size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{job.companyName}</p>
                        <p className="text-xs text-gray-500">Perusahaan</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <MapPin size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{job.location}</p>
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
                        <p className="font-semibold text-sm">{job.posted}</p>
                        <p className="text-xs text-gray-500">Dipublikasi</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Job Type Tags */}
              {job.type && job.type.length > 0 && (
                <div className="relative mt-6 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
                      <TrendingUp size={14} className="text-indigo-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Tipe Pekerjaan</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.type.map((typeStr, index) => (
                      <span key={index} className={`text-sm px-4 py-2 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 ${getJobTypeTagClass(typeStr)}`}>
                        {typeStr}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Skills Tags */}
              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <div className="relative mt-6 mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-sky-100 to-sky-200 rounded-lg flex items-center justify-center">
                      <Star size={14} className="text-sky-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Keahlian Dibutuhkan</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.slice(0, 5).map((skill, index) => (
                      <span key={index} className="bg-gradient-to-r from-sky-100 to-sky-200 text-sky-700 text-sm px-4 py-2 rounded-2xl font-semibold border border-sky-200/50 transition-all duration-200 hover:scale-105">
                        {skill}
                      </span>
                    ))}
                    {job.skillsRequired.length > 5 && (
                      <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-sm px-4 py-2 rounded-2xl font-semibold border border-gray-200/50">
                        +{job.skillsRequired.length - 5} lainnya
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Action Buttons */}
              <div className="relative mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {isApplied ? (
                      <div className="w-full flex-grow bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 border border-green-200/50 shadow-sm">
                          <CheckCircle size={20} />
                          <span>Lamaran Terkirim</span>
                      </div>
                  ) : (
                      <button 
                        onClick={() => handleQuickApplyClick(job)} 
                        className="group/btn w-full sm:w-auto flex-grow bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                          <ExternalLink size={18} className="group-hover/btn:rotate-12 transition-transform duration-200" />
                          <span>Lamar Cepat</span>
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </button>
                  )}
                  
                  <Link 
                    to={`/jobdetail/${job.id}`} 
                    className={`group/link w-full sm:w-auto flex-grow border-2 border-gray-200 hover:border-blue-300 px-8 py-4 rounded-2xl text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 font-semibold text-center flex items-center justify-center gap-3 ${isApplied ? 'pointer-events-none opacity-60' : 'hover:scale-105'}`}
                  >
                    <span>Lihat Detail</span>
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${isApplied ? 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-600' : 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700'}`}></div>
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