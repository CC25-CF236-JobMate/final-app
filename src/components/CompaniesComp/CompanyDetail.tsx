// src/components/CompaniesComp/CompanyDetail.tsx
import React from 'react';
import { type Company } from '../../services/CompanyService';
import { Link } from 'react-router-dom';
import { Mail, Phone, Globe, Building2, MapPin} from 'lucide-react';

interface CompanyDetailProps {
    company: Company;
}

const InfoItem: React.FC<{ icon: React.ElementType; label: string; value?: string | null, isLink?: boolean }> = ({ icon: Icon, label, value, isLink }) => {
    if (!value) return null;

    let href = value;
    if (isLink && !value.startsWith('http') && !value.startsWith('mailto') && !value.startsWith('tel')) {
        href = `https://${value}`;
    }
    if (label.toLowerCase() === 'email' && !value.startsWith('mailto')) {
        href = `mailto:${value}`;
    }
    if (label.toLowerCase() === 'telepon' && !value.startsWith('tel')) {
        href = `tel:${value}`;
    }

    return (
        <div className="flex items-start">
            <Icon className="w-5 h-5 text-blue-600 mr-4 mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                {isLink ? (
                     <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-800 hover:text-blue-700 hover:underline break-all">
                        {value}
                     </a>
                ) : (
                    <p className="font-medium text-gray-800">{value}</p>
                )}
            </div>
        </div>
    );
};

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company }) => {
    const companyInitial = company.companyName ? company.companyName.charAt(0).toUpperCase() : '?';
    
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* --- Banner dan Header --- */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-28 h-28 rounded-2xl bg-white shadow-lg border-4 border-white text-blue-600 flex items-center justify-center text-6xl font-bold flex-shrink-0">
                        {companyInitial}
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{company.companyName}</h1>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2 text-sm text-gray-600 mt-3">
                            <span className="flex items-center"><Building2 size={16} className="mr-2 text-gray-500"/>{company.industry || 'Industri Tidak Diketahui'}</span>
                            <span className="flex items-center"><MapPin size={16} className="mr-2 text-gray-500"/>{company.city}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* --- Tentang Perusahaan --- */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-4">Tentang Perusahaan</h2>
                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{company.aboutCompany}</p>
                </div>

                {/* --- Informasi Kontak & Lowongan --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-5">
                         <h2 className="text-2xl font-bold text-gray-800 mb-2 border-l-4 border-blue-500 pl-4">Kontak</h2>
                        <InfoItem icon={Globe} label="Website" value={company.website} isLink />
                        <InfoItem icon={Mail} label="Email" value={company.email} isLink />
                        <InfoItem icon={Phone} label="Telepon" value={company.phone} isLink />
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl text-center">
                        <p className="text-6xl font-extrabold text-blue-700 tracking-tight">{company.activeJobCount}</p>
                        <p className="text-lg font-semibold text-blue-800 mt-1">Lowongan Aktif</p>
                        <Link to={`/jobsearch?company=${encodeURIComponent(company.companyName)}`} className="mt-4 inline-block text-sm bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105 shadow-md">
                           Lihat Lowongan
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;
