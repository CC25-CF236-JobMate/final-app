// src/components/CompaniesComp/CompanyDetail.tsx
import React from 'react';
import { type Company } from '../../services/CompanyService';
import { Link } from 'react-router-dom';
import { Mail, Phone, Globe, Building2, MapPin, Briefcase, TrendingUp, ArrowRight, Users } from 'lucide-react';

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
        <div className="group flex items-start p-4 bg-white border border-gray-100/50 rounded-2xl hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 hover:border-blue-200/30">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-300">
                <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                {isLink ? (
                     <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-800 hover:text-blue-700 hover:underline break-all transition-colors duration-200 text-sm">
                        {value}
                     </a>
                ) : (
                    <p className="font-semibold text-gray-800 text-sm">{value}</p>
                )}
            </div>
        </div>
    );
};

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company }) => {
    const companyInitial = company.companyName ? company.companyName.charAt(0).toUpperCase() : '?';
    
    return (
        <div className="bg-white backdrop-blur-sm border border-gray-100/50 rounded-3xl shadow-2xl shadow-blue-500/5 overflow-hidden">
            {/* Gradient Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 opacity-30"></div>
            
            {/* --- Enhanced Banner dan Header --- */}
            <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 p-10">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    {/* Enhanced Logo dengan efek sama seperti Company.tsx */}
                    <div className="relative group">
                        <div className="w-32 h-32 bg-blue-50 text-black flex items-center justify-center text-6xl font-bold rounded-3xl shadow-xl shadow-blue-900/20 group-hover:shadow-2xl group-hover:shadow-blue-900/25 transition-all duration-500 group-hover:scale-105 border-4 border-white">
                            {companyInitial}
                        </div>
                        {/* Pulse ring effect */}
                        <div className="absolute inset-0 rounded-3xl bg-blue-900/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left">
                        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4 hover:text-blue-700 transition-colors duration-300">{company.companyName}</h1>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-3 text-base text-gray-600">
                            <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-200/50 shadow-sm">
                                <Building2 size={18} className="mr-3 text-blue-500"/>
                                <span className="font-medium">{company.industry || 'Industri Tidak Diketahui'}</span>
                            </div>
                            <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-200/50 shadow-sm">
                                <MapPin size={18} className="mr-3 text-blue-500"/>
                                <span className="font-medium">{company.city}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative p-10">
                {/* --- Enhanced About Section --- */}
                <div className="mb-12">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                            <Users size={20} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Tentang Perusahaan</h2>
                    </div>
                    <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 p-8 rounded-3xl border border-gray-100/50">
                        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">{company.aboutCompany}</p>
                    </div>
                </div>

                {/* --- Enhanced Grid Layout --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Contact Information */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                                <Mail size={20} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">Kontak</h2>
                        </div>
                        <div className="space-y-4">
                            <InfoItem icon={Globe} label="Website" value={company.website} isLink />
                            <InfoItem icon={Mail} label="Email" value={company.email} isLink />
                            <InfoItem icon={Phone} label="Telepon" value={company.phone} isLink />
                        </div>
                    </div>

                    {/* Enhanced Job Counter - sama seperti style di Company.tsx */}
                    <div className="group relative bg-gradient-to-br from-blue-50 via-white to-purple-50/30 p-8 rounded-3xl text-center border border-gray-100/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 hover:border-blue-200/30">
                        {/* Background overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                        
                        <div className="relative">
                            {/* Job count dengan icon */}
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                    <Briefcase size={24} className="text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-5xl font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{company.activeJobCount}</p>
                                    <p className="text-sm text-gray-500 font-medium">Lowongan Aktif</p>
                                </div>
                            </div>
                            
                            {/* Growth indicator */}
                            <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full mb-6 w-fit mx-auto">
                                <TrendingUp size={16} />
                                <span className="text-sm font-semibold">Aktif Merekrut</span>
                            </div>

                            {/* Enhanced CTA Button */}
                            <Link 
                                to={`/jobsearch?company=${encodeURIComponent(company.companyName)}`} 
                                className="group/btn inline-flex items-center space-x-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <span>Lihat Semua Lowongan</span>
                                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                            </Link>
                        </div>

                        {/* Bottom accent line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;