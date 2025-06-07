// src/components/list/PortfolioList.tsx
import React from 'react';
import { type PortfolioProject } from '../../services/PortfolioService';
import { Layers, Edit3, Trash2, PlusCircle, Tag, ExternalLink, Sparkles, Briefcase } from 'lucide-react';
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
    <div className="group relative p-6 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl hover:scale-[1.02] mb-6">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
      
      <div className="flex justify-between items-start">
        <div className="flex-grow mr-4">
          {/* Project Title with enhanced styling */}
          <div className="flex items-center mb-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mr-3 shadow-lg">
              <Layers size={20} className="text-white" strokeWidth={2}/>
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {project.title}
            </h3>
          </div>

          {/* Project URL with enhanced styling */}
          {project.projectUrl && (
            <a 
              href={project.projectUrl.startsWith('http') ? project.projectUrl : `https://${project.projectUrl}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300 mb-3 group/link"
            >
              <ExternalLink size={16} className="mr-2 group-hover/link:scale-110 transition-transform duration-300"/> 
              <span className="font-medium">Kunjungi Proyek</span>
            </a>
          )}

          {/* Description with improved typography */}
          {project.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          )}

          {/* Technologies with enhanced pill design */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <div className="flex items-center text-gray-500 mr-2">
                <Tag size={16} className="mr-1"/>
                <span className="text-xs font-medium">Teknologi:</span>
              </div>
              {project.technologies.map((tech, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 px-3 py-1.5 rounded-full border border-blue-200/50 font-medium hover:scale-105 transition-transform duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons with enhanced styling */}
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <button 
            onClick={onEdit} 
            className="p-3 text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all duration-300 group/edit hover:scale-110 hover:shadow-lg border border-blue-200 hover:border-blue-500"
            title="Edit Proyek Portfolio"
          >
            <Edit3 size={16} className="group-hover/edit:scale-110 transition-transform duration-300" />
          </button>
          <button 
            onClick={onDelete} 
            className="p-3 text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 group/delete hover:scale-110 hover:shadow-lg border border-red-200 hover:border-red-500"
            title="Hapus Proyek Portfolio"
          >
            <Trash2 size={16} className="group-hover/delete:scale-110 transition-transform duration-300" />
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
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: 'rgba(255, 255, 255, 0.95)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      customClass: { 
        popup: 'rounded-2xl shadow-2xl backdrop-blur-sm border border-white/50',
        confirmButton: 'rounded-xl font-medium',
        cancelButton: 'rounded-xl font-medium'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteClick(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 mt-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mr-3"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/5"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5"></div>
            </div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-14"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl shadow-lg mt-6">
        <div className="text-red-600 font-medium">
          ⚠️ Terjadi kesalahan: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mr-4 shadow-lg">
            <Briefcase size={24} className="text-white" strokeWidth={2}/>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Portfolio Proyek
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Kelola dan tampilkan karya terbaik Anda
            </p>
          </div>
        </div>
        
        {portfolioProjects.length > 0 && (
          <button
            onClick={onAddClick}
            className="group relative bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center overflow-hidden"
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <PlusCircle size={20} className="lg:mr-2 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative z-10 hidden lg:inline">Tambah Proyek</span>
          </button>
        )}
      </div>

      {portfolioProjects.length === 0 ? (
        <div className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-3xl"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl"></div>
          
          <div className="relative text-center py-16 px-8 border-2 border-dashed border-purple-200 rounded-3xl">
            <button
              onClick={onAddClick}
              className="group flex flex-col items-center text-purple-600 hover:text-purple-700 transition-all duration-300"
            >
              {/* Animated icon container */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Layers size={48} className="text-white" strokeWidth={1.5}/>
                </div>
                {/* Floating sparkles */}
                <Sparkles size={16} className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" />
                <Sparkles size={12} className="absolute -bottom-1 -left-1 text-blue-400 animate-pulse delay-300" />
              </div>
              
              <h3 className="font-bold text-xl mb-2 group-hover:scale-105 transition-transform duration-300">
                Tambah Portfolio Pertama
              </h3>
              <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                Bagikan proyek-proyek menakjubkan yang pernah Anda kerjakan dan tunjukkan keahlian Anda kepada dunia
              </p>
              
              {/* Call to action indicator */}
              <div className="mt-6 inline-flex items-center text-xs text-purple-500 font-medium">
                <span>Klik untuk memulai</span>
                <PlusCircle size={14} className="ml-1 group-hover:rotate-90 transition-transform duration-300" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {portfolioProjects.map(project => (
            <PortfolioListItem 
              key={project.id} 
              project={project} 
              onEdit={() => onEditClick(project)}
              onDelete={() => handleDeleteWithConfirmation(project.id!, project.title)}
            />
          ))}
          
          {/* Add more projects button at the bottom */}
          <div className="mt-8 text-center">
            <button
              onClick={onAddClick}
              className="group inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium py-3 px-6 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-all duration-300 border border-purple-200 hover:border-purple-300"
            >
              <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden lg:inline">Tambah Proyek Lainnya</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Decorative bottom section */}
      {portfolioProjects.length > 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 text-gray-500">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            <Sparkles size={16} className="text-purple-400" />
            <span className="text-sm font-medium">Portfolio yang menarik membuka peluang karir yang lebih baik</span>
            <Sparkles size={16} className="text-pink-400" />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioList;