// src/components/CompaniesComp/CompanySearch.tsx
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

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
        <div className="bg-white p-5 rounded-xl shadow-md mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Search by Name */}
                <div className="md:col-span-2">
                    <label htmlFor="search-company" className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Perusahaan</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="search-company"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Ketik nama perusahaan..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
                        />
                    </div>
                </div>

                {/* Filter by City */}
                <div>
                    <label htmlFor="filter-city" className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="filter-city"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Contoh: Jakarta"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
                        />
                    </div>
                </div>

                {/* Search Button */}
                <div className="flex gap-2">
                     <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                    >
                        <Search size={18} /> Cari
                    </button>
                    <button onClick={handleReset} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Reset</button>
                </div>
            </div>
        </div>
    );
};

export default CompanySearch;
