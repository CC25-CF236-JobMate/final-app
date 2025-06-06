// src/components/list/PortfolioList.tsx
import React from 'react';
import { type PortfolioProject } from '../../services/PortfolioService';
import { Layers, Edit3, Trash2, PlusCircle, Tag, ExternalLink } from 'lucide-react';
import Swal from 'sweetalert2';

interface PortfolioListProps {
  portfolioProjects: PortfolioProject[];
  isLoading: boolean;
  error?: string | null;
  onAddClick: () => void;
  onEditClick: (project: PortfolioProject) => void;
  onDeleteClick: (id: string) => void;
}

const PortfolioListItem: React.FC<{ project: PortfolioProject; onEdit: () => void; onDelete: () => void; }> = ({ project, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-white hover:bg-gray-50 transition-colors duration-150 rounded-lg border border-gray-200 shadow-sm mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-grow mr-3">
          <h3 className="text-md font-semibold text-indigo-700 flex items-center">
            <Layers size={18} className="mr-2 text-indigo-500"/> {project.title}
          </h3>
          {project.projectUrl && (
            <a 
              href={project.projectUrl.startsWith('http') ? project.projectUrl : `https://${project.projectUrl}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center mt-1"
            >
              <ExternalLink size={14} className="mr-1.5"/> Kunjungi Proyek
            </a>
          )}
          {project.description && (
            <p className="text-xs text-gray-600 mt-2 whitespace-pre-line leading-relaxed">
              {project.description}
            </p>
          )}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Tag size={14} className="mr-1 text-gray-500 mt-0.5"/>
              {project.technologies.map((tech, index) => (
                <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
          <button 
            onClick={onEdit} 
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
            aria-label="Edit Proyek Portfolio"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
            aria-label="Hapus Proyek Portfolio"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PortfolioList: React.FC<PortfolioListProps> = ({ portfolioProjects, isLoading, error, onAddClick, onEditClick, onDeleteClick }) => {
  
  const handleDeleteWithConfirmation = (id: string, title: string) => {
    Swal.fire({
      title: 'Anda yakin?',
      text: `Proyek portfolio "${title}" akan dihapus!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-xl shadow-lg' }
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteClick(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4 animate-pulse">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg border border-gray-200">
            <div className="h-5 bg-gray-300 rounded w-3/5 mb-2.5"></div>
            <div className="h-3 bg-gray-300 rounded w-2/5 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-4/5 mb-1.5"></div>
            <div className="h-3 bg-gray-300 rounded w-full"></div>
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
        <h2 className="text-xl font-semibold text-gray-700">Portfolio Proyek</h2>
        {portfolioProjects.length > 0 && (
          <button
            onClick={onAddClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm flex items-center text-sm"
          >
            <PlusCircle size={18} className="mr-2" />
            Tambah Proyek
          </button>
        )}
      </div>

      {portfolioProjects.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center min-h-[200px]">
          <button
            onClick={onAddClick}
            className="flex flex-col items-center text-indigo-600 hover:text-indigo-700 transition-colors group"
            aria-label="Tambah Proyek Portfolio Baru"
          >
            <Layers size={48} className="mb-3 text-indigo-500 group-hover:text-indigo-600 transition-colors" strokeWidth={1.5}/>
            <span className="font-semibold text-lg">Tambah Portfolio</span>
            <span className="text-sm text-gray-500 group-hover:text-gray-600">Bagikan proyek-proyek yang pernah Anda kerjakan.</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {portfolioProjects.map(project => (
            <PortfolioListItem 
              key={project.id} 
              project={project} 
              onEdit={() => onEditClick(project)}
              onDelete={() => handleDeleteWithConfirmation(project.id!, project.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioList;
