// src/components/list/ExperienceList.tsx
import React from 'react';
import { type ExperienceData, type EmploymentType } from '../../services/ExperienceService';
import { Briefcase, Building, Calendar, FileText, Edit3, Trash2, PlusCircle, MapPin, Clock, Star } from 'lucide-react';
import Swal from 'sweetalert2';

interface ExperienceListProps {
  experienceRecords: ExperienceData[];
  isLoading: boolean;
  error?: string | null;
  onAddClick: () => void;
  onEditClick: (experience: ExperienceData) => void;
  onDeleteClick: (id: string) => void;
}

const employmentTypeLabelsDisplay: Record<EmploymentType, string> = {
  'full-time': 'Penuh Waktu',
  'part-time': 'Paruh Waktu',
  contract: 'Kontrak',
  internship: 'Magang',
  freelance: 'Lepas',
};

const getEmploymentTypeStyle = (type: EmploymentType) => {
  const styles: Record<EmploymentType, string> = {
    'full-time': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    'part-time': 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
    contract: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white',
    internship: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white',
    freelance: 'bg-gradient-to-r from-pink-500 to-rose-600 text-white',
  };
  return styles[type] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
};

const ExperienceListItem: React.FC<{ experience: ExperienceData; onEdit: () => void; onDelete: () => void; }> = ({ experience, onEdit, onDelete }) => {
  const formatDate = (dateString?: string | null | Date) => {
    if (!dateString) return 'Sekarang';
    if (dateString instanceof Date) {
      return dateString.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    }
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
  };

  const employmentLabel = employmentTypeLabelsDisplay[experience.employmentType.toLowerCase() as EmploymentType] || experience.employmentType;
  const employmentTypeStyle = getEmploymentTypeStyle(experience.employmentType.toLowerCase() as EmploymentType);

  return (
    <div className="relative group">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl p-6 group-hover:scale-[1.02] transform">
        {/* Header with floating action buttons */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-grow">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Briefcase size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {experience.position}
                </h3>
                <div className="flex items-center text-gray-600">
                  <Building size={16} className="mr-2" />
                  <span className="font-medium">{experience.company}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating action buttons */}
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={onEdit} 
              className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 transform"
              aria-label="Edit Pengalaman"
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={onDelete} 
              className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 transform"
              aria-label="Hapus Pengalaman"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Employment type badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium shadow-lg ${employmentTypeStyle}`}>
            <Clock size={14} className="mr-1.5" />
            {employmentLabel}
          </span>
        </div>

        {/* Date range */}
        <div className="flex items-center text-gray-600 mb-4">
          <Calendar size={16} className="mr-2 text-gray-500" />
          <span className="text-sm font-medium">
            {formatDate(experience.startDate)} – {experience.endDate ? formatDate(experience.endDate) : 'Sekarang'}
          </span>
        </div>

        {/* Description */}
        {experience.description && (
          <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
            <div className="flex items-start">
              <FileText size={16} className="mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {experience.description}
              </p>
            </div>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
          <Star size={24} className="text-yellow-400 fill-current" />
        </div>
      </div>
    </div>
  );
};

const ExperienceList: React.FC<ExperienceListProps> = ({ experienceRecords, isLoading, error, onAddClick, onEditClick, onDeleteClick }) => {
  
  const handleDeleteWithConfirmation = (id: string, position: string, company: string) => {
    Swal.fire({
      title: 'Anda yakin?',
      text: `Pengalaman kerja sebagai ${position} di ${company} akan dihapus!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-gray-800',
        confirmButton: 'rounded-xl px-6 py-3 font-semibold',
        cancelButton: 'rounded-xl px-6 py-3 font-semibold'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteClick(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 mt-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-xl mr-4"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-300 rounded-lg w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded-lg w-1/2"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-300 rounded-full w-32 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                <div className="h-3 bg-gray-300 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center bg-gradient-to-br from-red-50 to-red-100/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-red-200/50 mt-8">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText size={24} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Terjadi Kesalahan</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <Briefcase size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Pengalaman Kerja</h2>
            <p className="text-gray-600 text-sm">Kelola riwayat pengalaman profesional Anda</p>
          </div>
        </div>
        
        {experienceRecords.length > 0 && (
          <button
            onClick={onAddClick}
            className="group relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center"
          >
            <PlusCircle size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Tambah Pengalaman
          </button>
        )}
      </div>

      {experienceRecords.length === 0 ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50/30 border-2 border-dashed border-blue-300/50 rounded-3xl p-12 text-center group hover:border-blue-400/50 transition-all duration-300">
          {/* Background decorative elements */}
          <div className="absolute top-6 left-6 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-6 right-6 w-24 h-24 bg-purple-400/10 rounded-full blur-xl"></div>
          
          <button
            onClick={onAddClick}
            className="relative flex flex-col items-center text-blue-600 hover:text-blue-700 transition-all duration-300 group-hover:scale-105 transform"
            aria-label="Tambah Pengalaman Kerja Baru"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-300">
                <Briefcase size={32} className="text-white" strokeWidth={1.5} />
              </div>
              {/* Floating mini icons */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center animate-bounce delay-100">
                <Building size={14} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -left-2 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center animate-bounce delay-300">
                <Calendar size={10} className="text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Tambah Pengalaman Kerja</h3>
            <p className="text-gray-600 max-w-md leading-relaxed">
              Bagikan riwayat pengalaman kerja dan pencapaian profesional Anda untuk memperkuat profil karir
            </p>
            
            {/* Call to action hint */}
            <div className="mt-6 flex items-center text-sm text-blue-600 font-medium">
              <span>Klik untuk memulai</span>
              <PlusCircle size={16} className="ml-2 group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {experienceRecords.map((exp, index) => (
            <div key={exp.id} className="animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${index * 100}ms` }}>
              <ExperienceListItem 
                experience={exp} 
                onEdit={() => onEditClick(exp)}
                onDelete={() => handleDeleteWithConfirmation(exp.id!, exp.position, exp.company)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Stats or summary section */}
      {experienceRecords.length > 0 && (
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50/50 rounded-2xl border border-blue-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <Star size={18} className="text-white fill-current" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {experienceRecords.length} Pengalaman Kerja
                </h3>
                <p className="text-sm text-gray-600">
                  Profil pengalaman yang lengkap meningkatkan kredibilitas Anda
                </p>
              </div>
            </div>
            <button
              onClick={onAddClick}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center hover:bg-blue-100 px-4 py-2 rounded-xl transition-all duration-300"
            >
              <PlusCircle size={16} className="mr-1" />
              Tambah Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceList;