// src/components/list/EducationList.tsx
import React from 'react';
import { type EducationData } from '../../services/EducationService';
import { School, Building2, Calendar, TrendingUp, Edit3, Trash2, PlusCircle, BookOpen } from 'lucide-react';
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
    // Menggunakan 'group' untuk mengontrol visibilitas tombol edit/hapus saat hover
    <div className="relative p-5 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-indigo-800 flex items-center">
            <School size={20} className="mr-3 text-indigo-500 flex-shrink-0"/> {education.level}
          </h3>
          <p className="text-md text-gray-800 flex items-center mt-2">
            <Building2 size={16} className="mr-3 text-gray-500 flex-shrink-0"/>{education.institution}
          </p>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <BookOpen size={16} className="mr-3 text-gray-500 flex-shrink-0"/>{education.major}
          </p>
          <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <Calendar size={14} className="mr-2"/> 
              <span>{formatDate(education.startDate)} – {education.endDate ? formatDate(education.endDate) : 'Sekarang'}</span>
            </div>
            {education.gpa && (
              <div className="flex items-center">
                <TrendingUp size={14} className="mr-2 text-green-500"/> IPK: {education.gpa}
              </div>
            )}
          </div>
        </div>
        {/* Tombol aksi (Edit & Hapus) yang muncul saat hover */}
        <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={onEdit} 
            className="p-2 text-blue-600 hover:text-blue-800 bg-white/50 hover:bg-blue-100/70 rounded-full transition-colors"
            aria-label="Edit Pendidikan"
          >
            <Edit3 size={18} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-2 text-red-500 hover:text-red-700 bg-white/50 hover:bg-red-100/70 rounded-full transition-colors"
            aria-label="Hapus Pendidikan"
          >
            <Trash2 size={18} />
          </button>
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
      confirmButtonColor: '#d33',
      cancelButtonColor: '#60a5fa', // Warna biru yang lebih lembut
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-xl shadow-lg bg-white/90 backdrop-blur-sm',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteClick(id);
      }
    });
  };

  // Tampilan saat data sedang dimuat (skeleton loader)
  if (isLoading) {
    return (
      <div className="space-y-4 mt-4 animate-pulse">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-5 bg-slate-100/50 rounded-xl">
            <div className="h-6 bg-slate-300/50 rounded w-3/5 mb-3"></div>
            <div className="h-4 bg-slate-300/50 rounded w-4/5 mb-2"></div>
            <div className="h-4 bg-slate-300/50 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Tampilan saat terjadi error
  if (error) {
    return <div className="text-center text-red-600 bg-red-100/50 border border-red-300 p-4 rounded-lg shadow-md mt-4">Error: {error}</div>;
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Riwayat Pendidikan
        </h2>
        {/* Tombol "Tambah" dengan style gradien, hanya muncul jika sudah ada data */}
        {educationRecords.length > 0 && (
          <button
            onClick={onAddClick}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-60 shadow-lg hover:shadow-xl hover:scale-105 flex items-center text-sm"
          >
            <PlusCircle size={18} className="mr-2" />
            Tambah
          </button>
        )}
      </div>

      {/* Tampilan saat tidak ada data pendidikan (empty state) */}
      {educationRecords.length === 0 ? (
        <div className="text-center py-16 px-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-2 border-white rounded-2xl shadow-inner flex flex-col items-center justify-center min-h-[250px]">
          <button
            onClick={onAddClick}
            className="flex flex-col items-center text-blue-600 hover:text-purple-600 transition-colors duration-300 group"
            aria-label="Tambah Riwayat Pendidikan Baru"
          >
            <div className="p-4 bg-white/70 rounded-full shadow-lg mb-4 group-hover:scale-110 transition-transform">
                <PlusCircle size={48} className="text-blue-500 group-hover:text-purple-500 transition-colors" strokeWidth={1.5} />
            </div>
            <span className="font-bold text-xl text-gray-700 group-hover:text-purple-700">Tambahkan Pendidikan Pertama Anda</span>
            <span className="text-md text-gray-500 mt-1">Bagikan perjalanan akademis Anda untuk melengkapi profil.</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {educationRecords.map(edu => (
            <EducationListItem 
              key={edu.id} 
              education={edu} 
              onEdit={() => onEditClick(edu)}
              onDelete={() => handleDeleteWithConfirmation(edu.id!, edu.institution)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationList;