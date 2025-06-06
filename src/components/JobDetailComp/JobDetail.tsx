// src/components/JobDetailComp/JobDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchJobById, type ApiJob } from '../../services/jobService';
import { auth } from '../../services/firebase';
import { addBookmark, removeBookmarkByJobId, getBookmarks } from '../../services/bookmarkService';
import Swal from 'sweetalert2';
import { 
    Bookmark, 
    ArrowLeft, 
    MapPin, 
    Clock, 
    Building2, 
    CircleDollarSign, 
    Star, 
    Briefcase,
    Tag,
    ExternalLink,
    ArrowRight 
} from 'lucide-react';
import ApplyJobModal from '../Modal/ApplyJob';

const formatPostedDateForDetail = (postedAtSeconds: number): string => {
    const date = new Date(postedAtSeconds * 1000);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 0) return "Tanggal tidak valid";
    return `${diffDays} hari yang lalu`;
};

const formatSalary = (salary?: ApiJob['salary']): string => {
    if (!salary || typeof salary.min !== 'number' || typeof salary.max !== 'number') {
        return "Tidak disebutkan";
    }
    const minSalaryInMillions = (salary.min / 1000000).toLocaleString('id-ID');
    const maxSalaryInMillions = (salary.max / 1000000).toLocaleString('id-ID');
    return `${salary.currency || 'IDR'} ${minSalaryInMillions}jt - ${maxSalaryInMillions}jt / bulan`;
};

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<ApiJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [isTogglingBookmark, setIsTogglingBookmark] = useState<boolean>(false);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (id) {
                setIsLoading(true);
                setError(null);
                try {
                    const jobData = await fetchJobById(id);
                    if (jobData) {
                        setJob(jobData);
                        if (auth.currentUser) {
                            const bookmarks = await getBookmarks();
                            const isMarked = bookmarks.some(b => b.jobId === id);
                            setIsBookmarked(isMarked);
                        }
                    } else {
                        setError("Detail pekerjaan tidak ditemukan (404).");
                    }
                } catch (err: unknown) {
                    setError("Gagal memuat detail pekerjaan. Coba lagi nanti.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setError("ID pekerjaan tidak valid atau tidak ditemukan.");
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);

    const toggleBookmark = async () => {
        if (!id) return;
        if (!auth.currentUser) {
            Swal.fire('Akses Ditolak', 'Anda harus login untuk menyimpan lowongan.', 'warning');
            return;
        }
        setIsTogglingBookmark(true);
        try {
            if (isBookmarked) {
                await removeBookmarkByJobId(id);
                setIsBookmarked(false);
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Bookmark dihapus', showConfirmButton: false, timer: 1500 });
            } else {
                await addBookmark(id);
                setIsBookmarked(true);
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Lowongan disimpan', showConfirmButton: false, timer: 1500 });
            }
        } catch (err: any) {
            Swal.fire('Error', err.message || 'Gagal memproses bookmark.', 'error');
        } finally {
            setIsTogglingBookmark(false);
        }
    };

    const handleApplyClick = () => {
        if (!auth.currentUser) {
            Swal.fire('Akses Ditolak', 'Anda harus login untuk melamar pekerjaan.', 'warning');
            return;
        }
        setIsApplyModalOpen(true);
    };

    const handleApplySuccess = () => {
        Swal.fire({
            title: 'Lamaran Terkirim!',
            text: 'Lamaran Anda telah berhasil dikirim. Semoga berhasil!',
            icon: 'success',
            confirmButtonText: 'Luar Biasa!',
            customClass: { popup: 'rounded-xl' }
        }).then(() => {
            navigate('/jobsearch');
        });
    };

    if (isLoading) {
        return (
            <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12 flex justify-center items-center">
                <div className="text-center bg-white backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-blue-100/50">
                    <div className="inline-flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xl font-semibold text-gray-700">Memuat detail pekerjaan...</span>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12 flex flex-col justify-center items-center text-center">
                <div className="bg-white backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-red-200/50 max-w-md">
                    <div className="text-red-600 text-lg mb-6 font-semibold">{error}</div>
                    <Link 
                        to="/jobsearch" 
                        className="inline-flex items-center gap-3 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Pencarian
                    </Link>
                </div>
            </section>
        );
    }

    if (!job) {
        return (
            <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12 flex flex-col justify-center items-center text-center">
                <div className="bg-white backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-gray-200/50 max-w-md">
                    <div className="text-gray-700 text-lg mb-6 font-semibold">Detail pekerjaan tidak tersedia.</div>
                    <Link 
                        to="/jobsearch" 
                        className="inline-flex items-center gap-3 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Pencarian
                    </Link>
                </div>
            </section>
        );
    }

    const companyInitial = job.companyName ? job.companyName.charAt(0).toUpperCase() : '?';

    return (
        <>
            <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Header dengan navigasi dan bookmark */}
                    <div className="flex justify-between items-center mb-8">
                        <Link 
                            to="/jobsearch" 
                            className="group inline-flex items-center gap-3 text-blue-600 hover:text-blue-800 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-sm border border-blue-100/50"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
                            <span>Kembali ke Pencarian</span>
                        </Link>
                        
                        <button 
                            onClick={toggleBookmark} 
                            disabled={isTogglingBookmark} 
                            className={`group w-14 h-14 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 hover:scale-110 shadow-lg ${
                                isBookmarked 
                                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-blue-500/20 border border-blue-200' 
                                    : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 border border-gray-200/50'
                            }`}
                        >
                            {isTogglingBookmark ? 
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto"></div> 
                                : <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} className="mx-auto" />
                            }
                        </button>
                    </div>

                    {/* Main content card */}
                    <div className="bg-white backdrop-blur-sm border border-gray-100/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500">
                        {/* Header section */}
                        <div className="relative p-8 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-purple-50/30"></div>
                            
                            <div className="relative flex flex-col sm:flex-row items-start gap-6">
                                {/* Company Logo */}
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-3xl font-bold shadow-xl shadow-blue-900/25 group-hover:shadow-2xl group-hover:shadow-blue-900/30 transition-all duration-300 group-hover:scale-105">
                                        <span className="text-white">{companyInitial}</span>
                                    </div>
                                    <div className="absolute inset-0 rounded-3xl bg-blue-900/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
                                </div>

                                <div className="flex-grow">
                                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">{job.jobTitle}</h1>
                                    <p className="text-xl text-gray-700 font-semibold mb-4">{job.companyName || "Nama Perusahaan Tidak Tersedia"}</p>
                                    
                                    {/* Quick info */}
                                    <div className="flex flex-wrap items-center gap-6 text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                                <MapPin size={14} className="text-gray-600" />
                                            </div>
                                            <span className="font-medium">{job.city}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                                                <Clock size={14} className="text-purple-600" />
                                            </div>
                                            <span className="font-medium">
                                                {job.postedAt ? formatPostedDateForDetail(job.postedAt._seconds) : "Tanggal tidak tersedia"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job details grid */}
                        <div className="p-8 border-b border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/30">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                        <Briefcase size={18} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Tipe Pekerjaan</p>
                                        <p className="font-bold text-gray-800 mt-1">{job.jobType || "Tidak disebutkan"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/30">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                                        <Tag size={18} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">Kategori</p>
                                        <p className="font-bold text-gray-800 mt-1">{job.category || "Tidak disebutkan"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl border border-green-200/30">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                        <CircleDollarSign size={18} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">Gaji</p>
                                        <p className="font-bold text-green-600 mt-1 text-sm">{formatSalary(job.salary)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200/30">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                                        <Building2 size={18} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">Lokasi</p>
                                        <p className="font-bold text-gray-800 mt-1">{job.city || "Tidak disebutkan"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content sections */}
                        <div className="p-8 space-y-10">
                            {/* About Company */}
                            {job.aboutCompany && (
                                <div className="relative">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                            <Building2 size={18} className="text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Tentang Perusahaan</h2>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50/50 to-transparent p-6 rounded-2xl border-l-4 border-blue-500">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.aboutCompany}</p>
                                    </div>
                                </div>
                            )}

                            {/* Job Description */}
                            {job.jobDescription && (
                                <div className="relative">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                                            <Briefcase size={18} className="text-indigo-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Deskripsi Pekerjaan</h2>
                                    </div>
                                    <div className="bg-gradient-to-r from-indigo-50/50 to-transparent p-6 rounded-2xl border-l-4 border-indigo-500">
                                        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {job.jobDescription}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Skills Required */}
                            {job.skillsRequired && job.skillsRequired.length > 0 && (
                                <div className="relative">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-r from-sky-100 to-sky-200 rounded-xl flex items-center justify-center">
                                            <Star size={18} className="text-sky-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Keahlian yang Dibutuhkan</h2>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {job.skillsRequired.map((skill, index) => (
                                            <span 
                                                key={index} 
                                                className="bg-gradient-to-r from-sky-100 to-sky-200 text-sky-700 font-semibold px-4 py-3 rounded-2xl border border-sky-200/50 transition-all duration-200 hover:scale-105 shadow-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Apply button section */}
                        <div className="p-8 bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-t border-gray-100">
                            <div className="text-center">
                                <button 
                                    onClick={handleApplyClick} 
                                    className="group bg-blue-900 hover:bg-blue-800 text-white font-bold px-12 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center gap-4 text-lg"
                                >
                                    <ExternalLink size={20} className="group-hover:rotate-12 transition-transform duration-200" />
                                    <span>Lamar Sekarang</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                                </button>
                                <p className="text-sm text-gray-600 mt-4">
                                    Kirim lamaran Anda dan raih kesempatan untuk bergabung dengan tim yang luar biasa!
                                </p>
                            </div>
                        </div>

                        {/* Bottom accent line */}
                        <div className="h-2 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700"></div>
                    </div>
                </div>
            </section>

            {isApplyModalOpen && (
                <ApplyJobModal 
                    jobId={id!} 
                    jobTitle={job.jobTitle || ''} 
                    companyName={job.companyName || ''} 
                    onClose={() => setIsApplyModalOpen(false)}
                    onApplySuccess={handleApplySuccess}
                />
            )}
        </>
    );
};

export default JobDetail;