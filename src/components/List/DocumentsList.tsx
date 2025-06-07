// src/components/list/DocumentList.tsx
import React from 'react';
import { type DocumentData } from '../../services/DocumentService';
import { FileText as FileIcon, Edit3, Trash2, PlusCircle, Eye, FilePlus, Award, FileCheck, FileX, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

interface DocumentListProps {
  documents: DocumentData[];
  isLoading: boolean;
  error?: string | null;
  onAddClick: () => void;
  onEditClick: (document: DocumentData) => void;
  onDeleteClick: (id: string) => void;
}

const DocumentListItem: React.FC<{ document: DocumentData; onEdit: () => void; onDelete: () => void; }> = ({ document, onEdit, onDelete }) => {
  const getFileIcon = (type: DocumentData['type']) => {
    switch (type.toLowerCase()) {
      case 'cv':
        return <FileCheck size={20} className="text-blue-500" />;
      case 'sertifikat':
        return <Award size={20} className="text-yellow-500" />;
      case 'portfolio':
        return <FileIcon size={20} className="text-purple-500" />;
      case 'ijazah':
        return <FileCheck size={20} className="text-green-500" />;
      default:
        return <FileIcon size={20} className="text-gray-500" />;
    }
  };

  const getTypeColor = (type: DocumentData['type']) => {
    switch (type.toLowerCase()) {
      case 'cv':
        return 'from-blue-500 to-blue-600';
      case 'sertifikat':
        return 'from-yellow-500 to-orange-500';
      case 'portfolio':
        return 'from-purple-500 to-pink-500';
      case 'ijazah':
        return 'from-green-500 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl mb-4 overflow-hidden">
      {/* Gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getTypeColor(document.type)}`}></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            {/* Enhanced Icon Container */}
            <div className={`flex-shrink-0 p-3 bg-gradient-to-br ${getTypeColor(document.type)} rounded-xl shadow-lg`}>
              <div className="p-1 bg-white/20 backdrop-blur-sm rounded-lg">
                {getFileIcon(document.type)}
              </div>
            </div>
            
            {/* Document Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 truncate mb-2 group-hover:text-gray-900 transition-colors" title={document.documentName}>
                {document.documentName}
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getTypeColor(document.type)}`}></div>
                  <span className="font-medium">{document.type}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={() => window.open(document.fileUrl, '_blank')}
              className="p-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
              title="Lihat/Unduh Dokumen"
              aria-label="Lihat/Unduh Dokumen"
            >
              <Eye size={18} />
            </button>
            
            <button 
              onClick={onEdit} 
              className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
              title="Edit Dokumen"
              aria-label="Edit Dokumen"
            >
              <Edit3 size={18} />
            </button>
            
            <button 
              onClick={onDelete} 
              className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
              title="Hapus Dokumen"
              aria-label="Hapus Dokumen"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Subtle hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-r ${getTypeColor(document.type)} opacity-5 rounded-2xl`}></div>
      </div>
    </div>
  );
};

const DocumentList: React.FC<DocumentListProps> = ({ documents, isLoading, error, onAddClick, onEditClick, onDeleteClick }) => {
  
  const handleDeleteWithConfirmation = (id: string, name: string) => {
    Swal.fire({
      title: 'Anda yakin?',
      text: `Dokumen "${name}" akan dihapus secara permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: 'rgba(255, 255, 255, 0.95)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      customClass: { 
        popup: 'rounded-2xl shadow-2xl border border-white/50',
        title: 'text-gray-800 font-semibold',
        content: 'text-gray-600',
        confirmButton: 'rounded-xl px-6 py-2.5 font-medium',
        cancelButton: 'rounded-xl px-6 py-2.5 font-medium'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteClick(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-3 text-red-600 bg-red-50/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-red-200/50 shadow-lg">
          <FileX size={20} />
          <span className="font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <FileIcon size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dokumen Saya</h2>
            <p className="text-gray-600 text-sm">Kelola CV, sertifikat, dan dokumen pendukung</p>
          </div>
        </div>
        
        {documents.length > 0 && (
          <button
            onClick={onAddClick}
            className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden lg:inline">Tambah Dokumen</span>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
          </button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="relative text-center py-16 px-6 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-3xl">
          {/* Background decoration */}
          <div className="absolute top-6 left-6 w-16 h-16 bg-blue-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-6 right-6 w-20 h-20 bg-purple-200/30 rounded-full blur-2xl"></div>
          
          <button
            onClick={onAddClick}
            className="group relative flex flex-col items-center text-gray-600 hover:text-gray-800 transition-all duration-300"
            aria-label="Tambah Dokumen Baru"
          >
            {/* Floating icons */}
            <div className="relative mb-6">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-blue-400/80 rounded-lg flex items-center justify-center animate-bounce delay-100">
                <Sparkles size={12} className="text-blue-800" />
              </div>
              <div className="absolute -top-2 -right-4 w-5 h-5 bg-green-400/80 rounded-full flex items-center justify-center animate-bounce delay-300">
                <Award size={10} className="text-green-800" />
              </div>
              
              <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <FilePlus size={48} className="text-white" strokeWidth={1.5}/>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-2 group-hover:text-green-600 transition-colors">
              Tambah Dokumen Pertama
            </h3>
            <p className="text-gray-500 max-w-md leading-relaxed">
              Unggah CV, sertifikat, ijazah, atau dokumen pendukung lainnya untuk melengkapi profil Anda
            </p>
            
            {/* Call to action indicator */}
            <div className="mt-6 flex items-center gap-2 text-sm text-green-600 font-medium">
              <span>Mulai unggah dokumen</span>
              <div className="w-4 h-px bg-green-400 group-hover:w-8 transition-all duration-300"></div>
            </div>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map(doc => (
            <DocumentListItem 
              key={doc.id} 
              document={doc} 
              onEdit={() => onEditClick(doc)}
              onDelete={() => handleDeleteWithConfirmation(doc.id!, doc.documentName)}
            />
          ))}
          
          {/* Add more button at the bottom */}
          <div className="mt-8 text-center">
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium py-3 px-6 rounded-2xl border-2 border-dashed border-green-300 hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group"
            >
              <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden lg:inline">Tambah Dokumen Lainnya</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;