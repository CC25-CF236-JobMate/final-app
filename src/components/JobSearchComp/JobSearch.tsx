// src/components/JobSearchComp/JobSearch.tsx
import React, { useState, useEffect } from 'react';
import Lowongan from './Lowongan'; 
import PaginationJobs from './PaginationJobs'; // Impor komponen pagination
import { searchJobs } from '../../services/jobService'; 
import type { DisplayJob, SearchJobFilters } from '../../services/jobService'; 
import { Search, Filter, MapPin, Briefcase, X, Sparkles, TrendingUp } from 'lucide-react';

const JOBS_PER_PAGE = 6;

const JobSearch: React.FC = () => {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [keyword, setKeyword] = useState(""); 
    const [location, setLocation] = useState(""); 
    const [selectedJobType, setSelectedJobType] = useState("Semua Tipe");
    const [mainSearchTerm, setMainSearchTerm] = useState("");
    const [allFetchedJobs, setAllFetchedJobs] = useState<DisplayJob[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAndFilterJobs = async (apiFilters: SearchJobFilters, clientSideJobTypeFilter: string) => {
        setIsLoading(true);
        setError(null);
        setCurrentPage(1);
        try {
            let fetchedJobs = await searchJobs(apiFilters);
            if (clientSideJobTypeFilter !== "Semua Tipe") {
                fetchedJobs = fetchedJobs.filter(job => 
                    job.type.some(type => 
                        type.toLowerCase().replace(/[\s-]/g, '') === clientSideJobTypeFilter.toLowerCase().replace(/[\s-]/g, '')
                    )
                );
            }
            setAllFetchedJobs(fetchedJobs);
        } catch (err: unknown) {
            setError("Gagal memuat lowongan. Silakan coba lagi nanti.");
            if (err instanceof Error) console.error("JobSearch fetch error:", err.message);
            else console.error("JobSearch fetch an unexpected error:", err);
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

    const indexOfLastJob = currentPage * JOBS_PER_PAGE;
    const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
    const currentJobsToDisplay = allFetchedJobs.slice(indexOfFirstJob, indexOfLastJob);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
            </div>

            <div className="relative px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-blue-700 px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
                            <Sparkles size={16} className="text-blue-600" />
                            <span>Platform Pencarian Kerja Terdepan</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight mb-6">
                            Temukan dan Lamar <br /> 
                            Pekerjaan Inklusif 
                            <br />Pilihanmu!
                        </h1>
                        
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Platform terbaik untuk menemukan dan melamar pekerjaan di startup dan perusahaan inovatif pilihan Anda.
                        </p>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="relative mb-12">
                        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl shadow-blue-900/10 p-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative flex-grow w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Posisi, Lokasi, atau Perusahaan" 
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 bg-white/70" 
                                        value={mainSearchTerm} 
                                        onChange={(e) => setMainSearchTerm(e.target.value)} 
                                        onKeyPress={(e) => e.key === 'Enter' && handleMainSearch()} 
                                    />
                                </div>
                                
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button 
                                        onClick={handleMainSearch} 
                                        className="group flex-grow sm:flex-grow-0 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                        aria-label="Cari Pekerjaan"
                                    >
                                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                        <span className="hidden sm:inline">Cari</span>
                                    </button>
                                    
                                    <button 
                                        onClick={toggleFilterModal} 
                                        className="group bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 px-6 py-4 rounded-2xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-semibold"
                                    >
                                        <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                                        <span className="hidden sm:inline">Filter</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Filter Modal */}
                    {showFilterModal && (
                        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 md:pt-32 px-4">
                            <div className="bg-white/95 backdrop-blur-sm w-full max-w-md rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                                {/* Modal Header */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200/50">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                                <Filter className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800">Saring Lowongan</h3>
                                        </div>
                                        <button 
                                            onClick={toggleFilterModal} 
                                            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 space-y-6">
                                    {/* Keyword Filter */}
                                    <div>
                                        <label htmlFor="filter-keyword" className="block mb-3 text-gray-700 font-semibold flex items-center gap-2">
                                            <div className="w-6 h-6 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                                                <Search className="w-3 h-3 text-green-600" />
                                            </div>
                                            Kata Kunci (Perusahaan)
                                        </label>
                                        <div className="relative">
                                            <input 
                                                id="filter-keyword" 
                                                type="text" 
                                                placeholder="Nama perusahaan..." 
                                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 bg-gray-50/50" 
                                                value={keyword} 
                                                onChange={(e) => setKeyword(e.target.value)} 
                                            />
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Location Filter */}
                                    <div>
                                        <label htmlFor="filter-location" className="block mb-3 text-gray-700 font-semibold flex items-center gap-2">
                                            <div className="w-6 h-6 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-3 h-3 text-red-600" />
                                            </div>
                                            Lokasi (Kota)
                                        </label>
                                        <div className="relative">
                                            <input 
                                                id="filter-location" 
                                                type="text" 
                                                placeholder="Contoh: Jakarta, Bandung" 
                                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 bg-gray-50/50" 
                                                value={location} 
                                                onChange={(e) => setLocation(e.target.value)} 
                                            />
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Job Type Filter */}
                                    <div>
                                        <label htmlFor="filter-jobtype" className="block mb-3 text-gray-700 font-semibold flex items-center gap-2">
                                            <div className="w-6 h-6 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                                                <Briefcase className="w-3 h-3 text-purple-600" />
                                            </div>
                                            Tipe Pekerjaan
                                        </label>
                                        <div className="relative">
                                            <select 
                                                id="filter-jobtype" 
                                                value={selectedJobType} 
                                                onChange={(e) => setSelectedJobType(e.target.value)} 
                                                className="w-full pl-12 pr-10 py-3 rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none appearance-none bg-gray-50/50 font-medium text-gray-700"
                                            >
                                                <option value="Semua Tipe">Semua Tipe</option>
                                                <option value="Fulltime">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Internship">Internship</option>
                                                <option value="WFH">WFH / Remote</option>
                                            </select>
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                                <svg className="w-5 h-5 fill-current text-gray-400" viewBox="0 0 20 20">
                                                    <path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.14-.446 1.576 0 .436.445.408 1.197 0 1.615L10 13.232l-4.484-4.07c-.408-.418-.436-1.17 0-1.615z"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div className="p-6 bg-gray-50/50 border-t border-gray-200/50">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button 
                                            onClick={handleApplyModalFilters} 
                                            className="flex-1 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                                        >
                                            Terapkan Filter
                                        </button>
                                        <button 
                                            onClick={handleResetModalFilters} 
                                            className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Header */}
                    <div className="mb-8">
                        <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {isLoading ? "Mencari lowongan..." : (allFetchedJobs.length > 0 ? `${allFetchedJobs.length} Lowongan Ditemukan` : "Lowongan Untukmu")}
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            {isLoading ? "Memuat data terbaru..." : "Menampilkan hasil pencarian terbaik"}
                                        </p>
                                    </div>
                                </div>
                                
                                {!isLoading && allFetchedJobs.length > 0 && (
                                    <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                                        <span>Halaman {currentPage} dari {Math.ceil(allFetchedJobs.length / JOBS_PER_PAGE)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <Lowongan jobs={currentJobsToDisplay} isLoading={isLoading} error={error} />
                    
                    {/* Pagination */}
                    {!isLoading && !error && allFetchedJobs.length > 0 && (
                        <div className="mt-12">
                            <PaginationJobs
                                totalJobs={allFetchedJobs.length}
                                jobsPerPage={JOBS_PER_PAGE}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default JobSearch;