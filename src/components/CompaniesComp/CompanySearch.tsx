// src/components/CompaniesComp/CompanySearch.tsx
import React, { useState } from 'react';
import { Search, MapPin, Building2, Filter, RotateCcw, Sparkles } from 'lucide-react';

interface CompanySearchProps {
    onSearch: (filters: { searchTerm: string, city: string, minJobs: number }) => void;
    isLoading: boolean;
}

const CompanySearch: React.FC<CompanySearchProps> = ({ onSearch, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [city, setCity] = useState('');
    const [minJobs, setMinJobs] = useState(0);

    const handleSearch = () => {
        onSearch({ searchTerm, city, minJobs });
    };
    
    const handleReset = () => {
        setSearchTerm('');
        setCity('');
        setMinJobs(0);
        onSearch({ searchTerm: '', city: '', minJobs: 0 });
    };

    return (
        <section className="relative mb-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
                        <Sparkles size={14} className="text-blue-600" />
                        <span>Pencarian Perusahaan Terdepan</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
                        Temukan Perusahaan Impianmu
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                        Jelajahi perusahaan-perusahaan terbaik dan temukan tempat kerja yang sempurna
                    </p>
                </div>

                {/* Enhanced Search Container */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl shadow-blue-900/10 p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        {/* Company Name Search */}
                        <div className="md:col-span-5">
                            <label htmlFor="search-company" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-5 h-5 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-3 h-3 text-green-600" />
                                </div>
                                Nama Perusahaan
                            </label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="search-company"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Ketik nama perusahaan..."
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 bg-white/70"
                                />
                            </div>
                        </div>

                        {/* City Filter */}
                        <div className="md:col-span-3">
                            <label htmlFor="filter-city" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-5 h-5 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-3 h-3 text-red-600" />
                                </div>
                                Lokasi Kota
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="filter-city"
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Contoh: Jakarta"
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 bg-white/70"
                                />
                            </div>
                        </div>

                        {/* Minimum Jobs Filter */}
                        <div className="md:col-span-2">
                            <label htmlFor="min-jobs" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <div className="w-5 h-5 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                                    <Filter className="w-3 h-3 text-orange-600" />
                                </div>
                                Min. Lowongan
                            </label>
                            <div className="relative">
                                <select
                                    id="min-jobs"
                                    value={minJobs}
                                    onChange={(e) => setMinJobs(Number(e.target.value))}
                                    className="w-full pl-4 pr-10 py-4 rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none appearance-none bg-white/70 font-medium text-gray-700"
                                >
                                    <option value={0}>Semua</option>
                                    <option value={1}>Min 1</option>
                                    <option value={2}>Min 2</option>
                                    <option value={5}>Min 5</option>
                                    <option value={10}>Min 10</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                    <svg className="w-5 h-5 fill-current text-gray-400" viewBox="0 0 20 20">
                                        <path d="M5.516 7.548c.436-.446 1.043-.48 1.576 0L10 10.405l2.908-2.857c.533-.48 1.14-.446 1.576 0 .436.445.408 1.197 0 1.615L10 13.232l-4.484-4.07c-.408-.418-.436-1.17 0-1.615z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="md:col-span-2 flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="group flex-1 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                aria-label="Cari Perusahaan"
                            >
                                <Search className={`w-5 h-5 transition-transform duration-200 ${!isLoading ? 'group-hover:scale-110' : ''}`} />
                                <span className="text-sm md:text-base">
                                    {isLoading ? 'Mencari...' : 'Cari'}
                                </span>
                            </button>
                            
                            <button
                                onClick={handleReset}
                                className="group bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 px-4 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-semibold"
                                aria-label="Reset Filter"
                            >
                                <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                                <span className="text-sm">Reset</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CompanySearch;