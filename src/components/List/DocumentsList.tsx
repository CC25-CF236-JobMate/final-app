// src/components/list/DocumentList.tsx
import React from 'react';
import { type DocumentData } from '../../services/DocumentService';
import { FileText as FileIcon, Edit3, Trash2, PlusCircle, Eye, FilePlus } from 'lucide-react';
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
        return <FileIcon size={18} className="text-blue-500" />;
      case 'sertifikat':
        return <FileIcon size={18} className="text-yellow-500" />;
      default:
        return <FileIcon size={18} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString?: string | Date | any) => {
    if (!dateString) return '-';
    // Handle Firestore Timestamp object if it's passed directly
    if (dateString.toDate && typeof dateString.toDate === 'function') {
      return dateString.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    try {
      return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch (e) {
      return String(dateString); // fallback if not a valid date string
    }
  };


  return (
    <div className="p-3.5 bg-white hover:bg-gray-50 transition-colors duration-150 rounded-lg border border-gray-200 shadow-sm mb-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center overflow-hidden mr-2">
          <div className="mr-3 flex-shrink-0 p-2 bg-gray-100 rounded-md">{getFileIcon(document.type)}</div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-800 truncate" title={document.documentName}>
              {document.documentName}
            </p>
            <p className="text-xs text-gray-500">
              Jenis: {document.type} <span className="mx-1">&bull;</span> Diunggah: {formatDate(document.uploadedAt)}
            </p>
          </div>
        </div>
        <div className="flex space-x-1.5 flex-shrink-0">
          <a 
            href={document.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
            title="Lihat/Unduh Dokumen"
            aria-label="Lihat/Unduh Dokumen"
          >
            <Eye size={16} /> {/* Changed from DownloadCloud to Eye for viewing */}
          </a>
          <button 
            onClick={onEdit} 
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
            title="Edit Dokumen"
            aria-label="Edit Dokumen"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
            title="Hapus Dokumen"
            aria-label="Hapus Dokumen"
          >
            <Trash2 size={16} />
          </button>
        </div>
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
      <div className="space-y-3 mt-4 animate-pulse">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg border border-gray-200 flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-md mr-3"></div>
            <div className="flex-grow">
                <div className="h-4 bg-gray-300 rounded w-3/5 mb-1.5"></div>
                <div className="h-3 bg-gray-300 rounded w-4/5"></div>
            </div>
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
        <h2 className="text-xl font-semibold text-gray-700">Dokumen Saya</h2>
        {documents.length > 0 && (
          <button
            onClick={onAddClick}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-sm flex items-center text-sm"
          >
            <PlusCircle size={18} className="mr-2" />
            Tambah Dokumen
          </button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center min-h-[200px]">
          <button
            onClick={onAddClick}
            className="flex flex-col items-center text-green-600 hover:text-green-700 transition-colors group"
            aria-label="Tambah Dokumen Baru"
          >
            <FilePlus size={48} className="mb-3 text-green-500 group-hover:text-green-600 transition-colors" strokeWidth={1.5}/>
            <span className="font-semibold text-lg">Tambah Dokumen</span>
            <span className="text-sm text-gray-500 group-hover:text-gray-600">Unggah CV, sertifikat, atau dokumen pendukung lainnya.</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => (
            <DocumentListItem 
              key={doc.id} 
              document={doc} 
              onEdit={() => onEditClick(doc)}
              onDelete={() => handleDeleteWithConfirmation(doc.id!, doc.documentName)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
