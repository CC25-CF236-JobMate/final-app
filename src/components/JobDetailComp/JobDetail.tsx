// src/components/JobDetailComp/JobDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchJobById, type ApiJob } from '../../services/jobService';
import { auth } from '../../services/firebase';
import { addBookmark, removeBookmarkByJobId, getBookmarks } from '../../services/bookmarkService';
import Swal from 'sweetalert2';
import { Bookmark } from 'lucide-react';
import ApplyJobModal from '../Modal/ApplyJob';

// ... (fungsi helper formatPostedDateForDetail dan formatSalary tetap sama)
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
    const navigate = useNavigate(); // Hook untuk navigasi
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
        // Tampilkan notifikasi sukses, lalu arahkan ke halaman pencarian
        Swal.fire({
            title: 'Lamaran Terkirim!',
            text: 'Lamaran Anda telah berhasil dikirim. Semoga berhasil!',
            icon: 'success',
            confirmButtonText: 'Luar Biasa!',
            customClass: { popup: 'rounded-xl' }
        }).then(() => {
            navigate('/jobsearch'); // Arahkan kembali ke halaman pencarian
        });
    };

    // ... (render logic for loading, error, !job remains the same)
    if (isLoading) {
        return <section className="bg-blue-50 min-h-screen px-4 py-12 flex justify-center items-center"><p className="text-gray-700 text-lg animate-pulse">Memuat detail pekerjaan...</p></section>;
    }
    if (error) {
        return <section className="bg-blue-50 min-h-screen px-4 py-12 flex flex-col justify-center items-center text-center"><p className="text-red-600 text-lg mb-4">{error}</p><Link to="/jobsearch" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Kembali ke Pencarian</Link></section>;
    }
    if (!job) {
        return <section className="bg-blue-50 min-h-screen px-4 py-12 flex flex-col justify-center items-center text-center"><p className="text-gray-700 text-lg mb-4">Detail pekerjaan tidak tersedia.</p><Link to="/jobsearch" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Kembali ke Pencarian</Link></section>;
    }


    const companyInitial = job.companyName ? job.companyName.charAt(0).toUpperCase() : '?';

    return (
        <>
            <section className="bg-blue-50 min-h-screen px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white p-4 sm:p-8 rounded-xl shadow-lg">
                    {/* ... (bagian header dan detail tetap sama) ... */}
                    <div className="flex justify-between items-center mb-6">
                        <Link to="/jobsearch" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1.5 p-2 rounded-md hover:bg-blue-50 transition-colors">
                            <img src="/backbutton.png" alt="Back" className="w-4 h-4" /> Kembali ke Pencarian
                        </Link>
                        <button onClick={toggleBookmark} disabled={isTogglingBookmark} className={`border border-gray-300 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 flex items-center gap-2 transition-colors disabled:opacity-50 ${isBookmarked ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200' : 'text-gray-700'}`}>
                            {isBookmarked ? 'Tersimpan' : 'Simpan'}
                            {isTogglingBookmark ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />}
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-blue-600 text-white flex items-center justify-center text-3xl sm:text-4xl font-semibold flex-shrink-0">
                            {companyInitial}
                        </div>
                        <div className="flex-grow">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{job.jobTitle}</h1>
                            <p className="text-gray-700 font-medium mb-1">{job.companyName || "Nama Perusahaan Tidak Tersedia"}</p>
                            <div className="text-sm text-gray-500">
                                📍 {job.city} &nbsp; • &nbsp; ⏰ {job.postedAt ? formatPostedDateForDetail(job.postedAt._seconds) : "Tanggal tidak tersedia"}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5 border rounded-lg p-4 sm:p-6 bg-slate-50 mb-8 text-sm">
                        <div><p className="text-xs text-gray-500 uppercase tracking-wider">Tipe Pekerjaan</p><p className="font-semibold text-gray-800 mt-0.5">{job.jobType || "Tidak disebutkan"}</p></div>
                        <div><p className="text-xs text-gray-500 uppercase tracking-wider">Kategori</p><p className="font-semibold text-gray-800 mt-0.5">{job.category || "Tidak disebutkan"}</p></div>
                        <div><p className="text-xs text-gray-500 uppercase tracking-wider">Gaji</p><p className="font-semibold text-gray-800 mt-0.5">{formatSalary(job.salary)}</p></div>
                        <div><p className="text-xs text-gray-500 uppercase tracking-wider">Lokasi Kota</p><p className="font-semibold text-gray-800 mt-0.5">{job.city || "Tidak disebutkan"}</p></div>
                    </div>

                    {job.aboutCompany && <div className="mb-8"><h2 className="text-xl font-semibold text-gray-800 mb-3">Tentang Perusahaan</h2><p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{job.aboutCompany}</p></div>}
                    {job.jobDescription && <div className="mb-8"><h2 className="text-xl font-semibold text-gray-800 mb-3">Deskripsi Pekerjaan</h2><div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">{job.jobDescription}</div></div>}
                    {job.skillsRequired && job.skillsRequired.length > 0 && <div className="mb-10"><h2 className="text-xl font-semibold text-gray-800 mb-3">Keahlian yang Dibutuhkan</h2><ul className="flex flex-wrap gap-2">{job.skillsRequired.map((skill, index) => <li key={index} className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">{skill}</li>)}</ul></div>}
                    
                    <div className="text-center">
                        <button onClick={handleApplyClick} className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors w-full sm:w-auto">
                            Lamar Sekarang
                        </button>
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
