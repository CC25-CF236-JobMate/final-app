// src/components/list/ExperienceList.tsx
import React from 'react';
import { type ExperienceData, type EmploymentType } from '../../services/ExperienceService';
import { Briefcase, Building, Calendar, FileText, Edit3, Trash2, PlusCircle } from 'lucide-react';
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

  return (
    <div className="p-4 bg-white hover:bg-gray-50 transition-colors duration-150 rounded-lg border border-gray-200 shadow-sm mb-3">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <h3 className="text-md font-semibold text-blue-700 flex items-center">
            <Briefcase size={18} className="mr-2 text-blue-500"/> {experience.position}
          </h3>
          <p className="text-sm text-gray-700 flex items-center mt-1">
            <Building size={16} className="mr-2 text-gray-500"/>{experience.company} <span className="mx-1 text-gray-400">&bull;</span> <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{employmentLabel}</span>
          </p>
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <Calendar size={14} className="mr-2"/> {formatDate(experience.startDate)} – {experience.endDate ? formatDate(experience.endDate) : 'Sekarang'}
          </p>
          {experience.description && (
            <p className="text-xs text-gray-600 mt-2 whitespace-pre-line leading-relaxed flex items-start">
              <FileText size={14} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0"/>
              <span>{experience.description}</span>
            </p>
          )}
        </div>
        <div className="flex space-x-2 flex-shrink-0 ml-2">
          <button 
            onClick={onEdit} 
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
            aria-label="Edit Pengalaman"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
            aria-label="Hapus Pengalaman"
          >
            <Trash2 size={16} />
          </button>
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
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-full"></div>
             <div className="h-3 bg-gray-300 rounded w-5/6 mt-1"></div>
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
        <h2 className="text-xl font-semibold text-gray-700">Pengalaman Kerja</h2>
        {experienceRecords.length > 0 && (
          <button
            onClick={onAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm flex items-center text-sm"
          >
            <PlusCircle size={18} className="mr-2" />
            Tambah Pengalaman
          </button>
        )}
      </div>

      {experienceRecords.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center min-h-[200px]">
          <button
            onClick={onAddClick}
            className="flex flex-col items-center text-blue-600 hover:text-blue-700 transition-colors group"
            aria-label="Tambah Pengalaman Kerja Baru"
          >
            <Briefcase size={48} className="mb-3 text-blue-500 group-hover:text-blue-600 transition-colors" strokeWidth={1.5}/>
            <span className="font-semibold text-lg">Tambah Pengalaman</span>
            <span className="text-sm text-gray-500 group-hover:text-gray-600">Bagikan riwayat pengalaman kerja Anda.</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {experienceRecords.map(exp => (
            <ExperienceListItem 
              key={exp.id} 
              experience={exp} 
              onEdit={() => onEditClick(exp)}
              onDelete={() => handleDeleteWithConfirmation(exp.id!, exp.position, exp.company)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceList;
