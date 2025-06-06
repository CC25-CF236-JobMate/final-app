// src/components/list/EducationList.tsx
import React from 'react';
import { type EducationData } from '../../services/EducationService';
import { Briefcase, BookOpen, Calendar, TrendingUp, Edit3, Trash2, PlusCircle } from 'lucide-react';
import Swal from 'sweetalert2';

interface EducationListProps {
  educationRecords: EducationData[];
  isLoading: boolean;
  error?: string | null;
  onAddClick: () => void;
  onEditClick: (education: EducationData) => void;
  onDeleteClick: (id: string) => void;
}

const EducationListItem: React.FC<{ education: EducationData; onEdit: () => void; onDelete: () => void; }> = ({ education, onEdit, onDelete }) => {
  const formatDate = (dateString?: string | null | Date) => {
    if (!dateString) return 'Sekarang';
    if (dateString instanceof Date) {
      return dateString.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    }
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) -1);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="p-4 bg-white hover:bg-gray-50 transition-colors duration-150 rounded-lg border border-gray-200 shadow-sm mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-md font-semibold text-blue-700 flex items-center">
            <Briefcase size={18} className="mr-2 text-blue-500"/> {education.level}
          </h3>
          <p className="text-sm text-gray-700 flex items-center mt-1">
            <BookOpen size={16} className="mr-2 text-gray-500"/>{education.institution} - {education.major}
          </p>
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <Calendar size={14} className="mr-2"/> {formatDate(education.startDate)} – {education.endDate ? formatDate(education.endDate) : 'Sekarang'}
          </p>
          {education.gpa && (
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <TrendingUp size={14} className="mr-2"/> IPK: {education.gpa}
            </p>
          )}
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          <button 
            onClick={onEdit} 
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
            aria-label="Edit Pendidikan"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
            aria-label="Hapus Pendidikan"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const EducationList: React.FC<EducationListProps> = ({ educationRecords, isLoading, error, onAddClick, onEditClick, onDeleteClick }) => {
  
  const handleDeleteWithConfirmation = (id: string, institution: string) => {
    Swal.fire({
      title: 'Anda yakin?',
      text: `Riwayat pendidikan di ${institution} akan dihapus secara permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-xl shadow-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteClick(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3 mt-4 animate-pulse">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg border border-gray-200">
            <div className="h-5 bg-gray-300 rounded w-3/5 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-4/5 mb-1.5"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg shadow mt-4">Error: {error}</div>;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Riwayat Pendidikan</h2>
        {/* Tombol Tambah kecil hanya muncul jika ada data pendidikan */}
        {educationRecords.length > 0 && (
          <button
            onClick={onAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm flex items-center text-sm"
          >
            <PlusCircle size={18} className="mr-2" />
            Tambah Pendidikan
          </button>
        )}
      </div>

      {educationRecords.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center min-h-[200px]">
          <button
            onClick={onAddClick}
            className="flex flex-col items-center text-blue-600 hover:text-blue-700 transition-colors group"
            aria-label="Tambah Riwayat Pendidikan Baru"
          >
            <PlusCircle size={48} className="mb-3 text-blue-500 group-hover:text-blue-600 transition-colors" strokeWidth={1.5} />
            <span className="font-semibold text-lg">Tambah Pendidikan</span>
            <span className="text-sm text-gray-500 group-hover:text-gray-600">Mulai tambahkan riwayat pendidikan Anda.</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
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
