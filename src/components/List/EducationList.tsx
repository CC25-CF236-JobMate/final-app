// src/components/list/EducationList.tsx
import React from 'react';
import { type EducationData } from '../../services/EducationService';
import { School, Building2, Calendar, TrendingUp, Edit3, Trash2, PlusCircle, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

interface EducationListProps {
  educationRecords: EducationData[];
  isLoading: boolean;
  error?: string | null;
  onAddClick: () => void;
  onEditClick: (education: EducationData) => void;
  onDeleteClick: (id: string) => void;
}

// Sub-komponen untuk setiap item dalam daftar pendidikan
const EducationListItem: React.FC<{ education: EducationData; onEdit: () => void; onDelete: () => void; }> = ({ education, onEdit, onDelete }) => {
  // Fungsi untuk memformat tanggal ke format "Bulan Tahun" dalam Bahasa Indonesia
  const formatDate = (dateString?: string | null | Date) => {
    if (!dateString) return 'Sekarang';
    // Menangani jika tanggal sudah berupa objek Date
    if (dateString instanceof Date) {
      return dateString.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    }
    // Menangani format 'YYYY-MM'
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="relative p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Header dengan icon yang lebih menarik */}
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap size={24} className="text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  {education.level}
                </h3>
                <div className="flex items-center mt-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-500 font-medium">Pendidikan</span>
                </div>
              </div>
            </div>

            {/* Institution */}
            <div className="flex items-center mb-3 p-3 bg-white/50 rounded-xl border border-white/30">
              <Building2 size={18} className="mr-3 text-blue-500 flex-shrink-0"/> 
              <span className="text-gray-800 font-semibold">{education.institution}</span>
            </div>

            {/* Major */}
            <div className="flex items-center mb-4 p-3 bg-white/50 rounded-xl border border-white/30">
              <BookOpen size={18} className="mr-3 text-purple-500 flex-shrink-0"/>
              <span className="text-gray-700">{education.major}</span>
            </div>

            {/* Date and GPA info */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200/50">
                <Calendar size={16} className="mr-2 text-blue-600"/> 
                <span className="text-sm text-blue-800 font-medium">
                  {formatDate(education.startDate)} – {education.endDate ? formatDate(education.endDate) : 'Sekarang'}
                </span>
              </div>
              {education.gpa && (
                <div className="flex items-center bg-gradient-to-r from-green-50 to-teal-50 px-4 py-2 rounded-xl border border-green-200/50">
                  <TrendingUp size={16} className="mr-2 text-green-600"/> 
                  <span className="text-sm text-green-800 font-medium">IPK: {education.gpa}</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button 
              onClick={onEdit} 
              className="p-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              aria-label="Edit Pendidikan"
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={onDelete} 
              className="p-3 text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              aria-label="Hapus Pendidikan"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen utama daftar pendidikan
const EducationList: React.FC<EducationListProps> = ({ educationRecords, isLoading, error, onAddClick, onEditClick, onDeleteClick }) => {
  
  // Fungsi konfirmasi hapus menggunakan SweetAlert2
  const handleDeleteWithConfirmation = (id: string, institution: string) => {
    Swal.fire({
      title: 'Anda yakin?',
      text: `Riwayat pendidikan di ${institution} akan dihapus secara permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20',
        title: 'text-gray-800 font-bold',
        content: 'text-gray-600',
        confirmButton: 'rounded-xl font-semibold',
        cancelButton: 'rounded-xl font-semibold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteClick(id);
      }
    });
  };

  // Enhanced loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 mt-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl mr-4"></div>
              <div className="flex-1">
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-2/3 mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/3"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
              <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
              <div className="flex gap-3">
                <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl flex-1"></div>
                <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl flex-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="text-center text-red-600 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 p-6 rounded-2xl shadow-lg mt-6 backdrop-blur-sm">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <School size={24} className="text-red-500" />
        </div>
        <p className="font-semibold">Terjadi Kesalahan</p>
        <p className="text-sm text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg mr-4">
            <GraduationCap size={28} className="text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Riwayat Pendidikan
            </h2>
            <p className="text-gray-500 text-sm mt-1">Kelola informasi pendidikan Anda</p>
          </div>
        </div>
        
        {/* Add Button - Only show if there are existing records */}
        {educationRecords.length > 0 && (
          <button
            onClick={onAddClick}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl hover:scale-105 flex items-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Tambah
          </button>
        )}
      </div>

      {/* Enhanced Empty State */}
      {educationRecords.length === 0 ? (
        <div className="text-center py-20 px-8 bg-gradient-to-br from-green-50/70 via-white/50 to-teal-50/70 backdrop-blur-sm border-2 border-white/30 rounded-3xl shadow-xl relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-400/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-400/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <button
              onClick={onAddClick}
              className="flex flex-col items-center text-green-600 hover:text-teal-600 transition-all duration-500 group"
              aria-label="Tambah Riwayat Pendidikan Baru"
            >
              {/* Enhanced icon with multiple decorative elements */}
              <div className="relative mb-6">
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400/80 rounded-full flex items-center justify-center animate-bounce delay-100">
                  <Sparkles size={12} className="text-green-800" />
                </div>
                <div className="absolute -bottom-1 -left-2 w-4 h-4 bg-teal-400/80 rounded-full animate-pulse delay-300"></div>
                
                <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/40">
                  <GraduationCap size={56} className="text-green-500 group-hover:text-teal-500 transition-colors duration-300" strokeWidth={1.5} />
                </div>
              </div>
              
              <h3 className="font-bold text-2xl text-gray-700 group-hover:text-teal-700 transition-colors duration-300 mb-2">
                Tambahkan Pendidikan Pertama Anda
              </h3>
              <p className="text-gray-500 group-hover:text-gray-600 transition-colors duration-300 max-w-md leading-relaxed">
                Bagikan perjalanan akademis Anda untuk melengkapi profil dan meningkatkan peluang karir
              </p>
              
              {/* Call-to-action indicator */}
              <div className="mt-6 flex items-center text-sm text-green-600 group-hover:text-teal-600 transition-colors">
                <span className="mr-2">Klik untuk memulai</span>
                <PlusCircle size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Education Records List */
        <div className="space-y-6">
          {educationRecords.map((edu, index) => (
            <div
              key={edu.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <EducationListItem 
                education={edu} 
                onEdit={() => onEditClick(edu)}
                onDelete={() => handleDeleteWithConfirmation(edu.id!, edu.institution)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add subtle animation styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EducationList;