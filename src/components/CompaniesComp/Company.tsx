// src/components/CompaniesComp/Company.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { type Company } from '../../services/CompanyService';
import { Briefcase, MapPin, Users, TrendingUp, ArrowRight } from 'lucide-react';

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
    return (
        <div className="group relative bg-white backdrop-blur-sm border border-gray-100/50 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 hover:border-blue-200/30">
            {/* Gradient Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            


            <div className="relative p-8">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                        {/* Enhanced Logo */}
                        <div className="relative">
                            <div className="w-20 h-20 bg-blue-50 text-black flex items-center justify-center text-2xl font-bold rounded-2xl shadow-lg shadow-blue-900/25 group-hover:shadow-xl group-hover:shadow-blue-900/30 transition-all duration-300 group-hover:scale-105">
                                {company.companyName.charAt(0).toUpperCase()}
                            </div>
                            {/* Pulse ring effect */}
                            <div className="absolute inset-0 rounded-2xl bg-blue-900/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
                        </div>

                        {/* Company Info */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300" title={company.companyName}>
                                {company.companyName}
                            </h3>
                            <div className="flex items-center text-gray-500 mb-3">
                                <MapPin size={16} className="mr-2 text-blue-500" />
                                <span className="text-sm font-medium">{company.city}</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Action Button */}
                    <Link 
                        to={`/companies/${company.id}`} 
                        className="hidden md:flex items-center space-x-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group/btn"
                    >
                        <span>Lihat Profil</span>
                        <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                    </Link>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm group-hover:text-gray-700 transition-colors duration-300">
                        {company.aboutCompany}
                    </p>
                </div>

                {/* Stats and Tags */}
                <div className="space-y-4">
                    {/* Job Count Highlight */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                                <Briefcase size={16} className="text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{company.activeJobCount}</p>
                                <p className="text-xs text-gray-500 font-medium">Lowongan Aktif</p>
                            </div>
                        </div>
                        
                        {/* Growth Indicator */}
                        <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                            <TrendingUp size={12} />
                            <span className="text-xs font-semibold">Aktif Merekrut</span>
                        </div>
                    </div>

                    {/* Industry Tag */}
                    {company.industry && (
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 px-4 py-2 rounded-2xl">
                                <Users size={14} className="text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">{company.industry}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Action Button */}
                <div className="mt-6 md:hidden">
                    <Link 
                        to={`/companies/${company.id}`} 
                        className="flex items-center justify-center space-x-2 w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-2xl text-sm font-semibold transition-all duration-300 transform active:scale-95 shadow-lg"
                    >
                        <span>Lihat Profil Perusahaan</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
    );
};

export default CompanyCard;