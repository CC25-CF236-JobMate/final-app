// src/components/JobSearch.tsx
import React, { useState, useEffect } from 'react';
import Lowongan from './Lowongan'; 
import PaginationJobs from './PaginationJobs'; // Impor komponen pagination
import { searchJobs } from '../../services/jobService'; 
import type { DisplayJob, SearchJobFilters } from '../../services/jobService'; 
import { Search, Filter, MapPin, Briefcase } from 'lucide-react';

const JOBS_PER_PAGE = 6; // Konstanta untuk jumlah pekerjaan per halaman

const JobSearch: React.FC = () => {
    const [showFilterModal, setShowFilterModal] = useState(false);
    
    const [keyword, setKeyword] = useState(""); 
    const [location, setLocation] = useState(""); 
    const [selectedJobType, setSelectedJobType] = useState("Semua Tipe");

    const [mainSearchTerm, setMainSearchTerm] = useState("");

    const [allFetchedJobs, setAllFetchedJobs] = useState<DisplayJob[]>([]); // Menyimpan semua job hasil fetch
    const [currentPage, setCurrentPage] = useState<number>(1); // Halaman saat ini

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAndFilterJobs = async (apiFilters: SearchJobFilters, clientSideJobTypeFilter: string) => {
        setIsLoading(true);
        setError(null);
        setCurrentPage(1); // Selalu reset ke halaman pertama saat filter baru diterapkan
        try {
            let fetchedJobs = await searchJobs(apiFilters);

            if (clientSideJobTypeFilter !== "Semua Tipe") {
                fetchedJobs = fetchedJobs.filter(job => 
                    job.type.some(type => 
                        type.toLowerCase().replace(/[\s-]/g, '') === clientSideJobTypeFilter.toLowerCase().replace(/[\s-]/g, '')
                    )
                );
            }
            setAllFetchedJobs(fetchedJobs); // Simpan semua hasil fetch
        } catch (err: unknown) { // ✅ Perubahan di sini: err: unknown
            setError("Gagal memuat lowongan. Silakan coba lagi nanti.");
            // Untuk logging developer, Anda bisa cek instance error:
            if (err instanceof Error) {
                console.error("JobSearch fetch error:", err.message);
            } else {
                console.error("JobSearch fetch an unexpected error:", err);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAndFilterJobs({}, "Semua Tipe"); 
    }, []);

    const handleApplyModalFilters = () => {
        const apiFilters: SearchJobFilters = {};
        if (keyword.trim()) apiFilters.companyName = keyword.trim();
        if (location.trim()) apiFilters.city = location.trim();
        
        fetchAndFilterJobs(apiFilters, selectedJobType);
        setShowFilterModal(false);
    };

    const handleResetModalFilters = () => {
        setKeyword("");
        setLocation("");
        setSelectedJobType("Semua Tipe");
        fetchAndFilterJobs({}, "Semua Tipe"); 
        setShowFilterModal(false);
    };

    const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

    const handleMainSearch = () => {
        const apiFilters: SearchJobFilters = {};
        if (mainSearchTerm.trim()) apiFilters.companyName = mainSearchTerm.trim();
        if (location.trim() && !apiFilters.companyName) apiFilters.city = location.trim();

        fetchAndFilterJobs(apiFilters, selectedJobType);
    };

    // Logika untuk mendapatkan pekerjaan pada halaman saat ini
    const indexOfLastJob = currentPage * JOBS_PER_PAGE;
    const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
    const currentJobsToDisplay = allFetchedJobs.slice(indexOfFirstJob, indexOfLastJob);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll ke atas sedikit saat ganti halaman
    };

    return (
        <section className="bg-blue-50 min-h-screen px-4 py-16">
            <div className="max-w-5xl mx-auto">
                {/* Hero & Search Bar (tidak berubah signifikan, hanya value & onChange) */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        Temukan dan Lamar <br /> Pekerjaan Inklusif Pilihanmu!
                    </h1>
                    <p className="text-sm text-gray-600 max-w-xl mx-auto">
                        The best place to discover & apply to the coolest start-up jobs.
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12">
                    <input
                        type="text"
                        placeholder="Posisi, Lokasi, atau Perusahaan"
                        className="w-full max-w-xs sm:max-w-md px-4 py-2 rounded-lg border border-gray-300"
                        value={mainSearchTerm}
                        onChange={(e) => setMainSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleMainSearch()}
                    />
                    <button 
                        onClick={handleMainSearch}
                        className="bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition-colors"
                        aria-label="Cari Pekerjaan"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                    <button
                        onClick={toggleFilterModal}
                        className="bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filters</span>
                    </button>
                </div>

                {/* Filter Modal (tidak berubah signifikan) */}
                {showFilterModal && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 md:pt-32 px-4">
                        <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Saring Lowongan
                                </h3>
                                <button onClick={toggleFilterModal} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
                            </div>
                            
                            <div className="space-y-4 text-sm">
                                <div>
                                    <label htmlFor="filter-keyword" className="block mb-1 text-gray-700 font-medium">Kata Kunci (Perusahaan)</label>
                                    <div className="relative">
                                        <input
                                            id="filter-keyword"
                                            type="text"
                                            placeholder="Nama perusahaan..."
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="filter-location" className="block mb-1 text-gray-700 font-medium">Lokasi (Kota)</label>
                                    <div className="relative">
                                        <input
                                            id="filter-location"
                                            type="text"
                                            placeholder="Contoh: Jakarta, Bandung"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="filter-jobtype" className="block mb-1 text-gray-700 font-medium">Tipe Pekerjaan</label>
                                    <div className="relative">
                                        <select
                                            id="filter-jobtype"
                                            value={selectedJobType}
                                            onChange={(e) => setSelectedJobType(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none appearance-none bg-white"
                                        >
                                            <option value="Semua Tipe">Semua Tipe</option>
                                            <option value="Fulltime">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                            <option value="WFH">WFH / Remote</option>
                                        </select>
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 20 20">
                                                <path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.14-.446 1.576 0 .436.445.408 1.197 0 1.615L10 13.232l-4.484-4.07c-.408-.418-.436-1.17 0-1.615z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                <button
                                    onClick={handleApplyModalFilters}
                                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-medium transition-colors"
                                >
                                    Terapkan Filter
                                </button>
                                <button
                                    onClick={handleResetModalFilters}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                <div className="flex justify-between items-center mb-4 mt-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        {isLoading ? "Mencari lowongan..." : (allFetchedJobs.length > 0 ? `Menampilkan Lowongan` : "Lowongan Untukmu")}
                    </h2>
                </div>
                
                {/* Tampilkan pekerjaan yang sudah dipaginasi */}
                <Lowongan jobs={currentJobsToDisplay} isLoading={isLoading} error={error} />

                {/* Tampilkan komponen pagination */}
                {!isLoading && !error && allFetchedJobs.length > 0 && (
                    <PaginationJobs
                        totalJobs={allFetchedJobs.length}
                        jobsPerPage={JOBS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </section>
    );
};

export default JobSearch;