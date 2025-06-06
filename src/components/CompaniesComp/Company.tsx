// src/components/CompaniesComp/Company.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { type Company } from '../../services/CompanyService';
import { Briefcase, MapPin, ArrowRight } from 'lucide-react';

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
    <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold rounded-xl flex-shrink-0">
                {company.companyName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow overflow-hidden">
                <h3 className="text-xl font-bold text-gray-900 truncate" title={company.companyName}>{company.companyName}</h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin size={14} className="mr-1.5"/> {company.city}
                </p>
            </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 h-10 mb-4">{company.aboutCompany}</p>
        <div className="flex items-center text-sm font-medium text-blue-700">
            <Briefcase size={16} className="mr-2"/>
            <span>{company.activeJobCount} Lowongan Aktif</span>
        </div>
    </div>
    <div className="bg-gray-50 group-hover:bg-blue-500 p-4 rounded-b-2xl border-t transition-colors duration-300">
        <Link to={`/companies/${company.id}`} className="flex justify-between items-center text-blue-600 group-hover:text-white font-semibold">
            <span>Lihat Profil Perusahaan</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1"/>
        </Link>
    </div>
  </div>
);

export default CompanyCard;
