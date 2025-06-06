// src/components/EditForm/EditDocumentForm.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { type DocumentData, updateDocument, documentTypes } from '../../services/DocumentService';
import Swal from 'sweetalert2';
import { Save, X, FileEdit, Type, UploadCloud, File, Sparkles } from 'lucide-react';

interface EditDocumentFormProps {
  initialData: DocumentData;
  onClose: () => void;
  onUpdateSuccess: (updatedDocument: DocumentData) => void;
}

const EditDocumentForm: React.FC<EditDocumentFormProps> = ({ initialData, onClose, onUpdateSuccess }) => {
  const [documentName, setDocumentName] = useState(initialData.documentName);
  const [type, setType] = useState<DocumentData['type']>(initialData.type);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState<string | null>(null);
  const [fileNameDisplay, setFileNameDisplay] = useState<string>('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<'documentName' | 'type', string>>>({});

  useEffect(() => {
    setDocumentName(initialData.documentName);
    setType(initialData.type);
    setSelectedFile(null);
    setBase64String(null);
    setFileNameDisplay('');
  }, [initialData]);

  const validateField = (name: 'documentName' | 'type', value: any): string => {
    switch (name) {
      case 'documentName':
        return value && value.trim() !== '' ? '' : 'Nama Dokumen wajib diisi.';
      case 'type':
        return value && value.trim() !== '' ? '' : 'Jenis Dokumen wajib dipilih.';
      default:
        return '';
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        Swal.fire({
          title: 'Format Salah',
          text: 'Hanya file PDF yang diizinkan.',
          icon: 'error',
          customClass: {
            popup: 'rounded-2xl shadow-2xl border border-white/50',
            title: 'text-gray-800 font-semibold',
            content: 'text-gray-600',
            confirmButton: 'rounded-xl px-6 py-2.5 font-medium'
          }
        });
        setSelectedFile(null); setBase64String(null); setFileNameDisplay(''); e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        Swal.fire({
          title: 'Ukuran Terlalu Besar',
          text: 'Ukuran file PDF maksimal 5MB.',
          icon: 'error',
          customClass: {
            popup: 'rounded-2xl shadow-2xl border border-white/50',
            title: 'text-gray-800 font-semibold',
            content: 'text-gray-600',
            confirmButton: 'rounded-xl px-6 py-2.5 font-medium'
          }
        });
        setSelectedFile(null); setBase64String(null); setFileNameDisplay(''); e.target.value = '';
        return;
      }
      setSelectedFile(file);
      setFileNameDisplay(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBase64String(result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null); setBase64String(null); setFileNameDisplay('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let formIsValid = true;
    const newErrors: Partial<Record<'documentName' | 'type', string>> = {};
    newErrors.documentName = validateField('documentName', documentName);
    newErrors.type = validateField('type', type);

    if (newErrors.documentName || newErrors.type ) {
        formIsValid = false;
    }
    setErrors(newErrors);

    if (!formIsValid) {
      Swal.fire({
        title: 'Validasi Gagal',
        text: 'Mohon periksa kembali isian form Anda.',
        icon: 'error',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-white/50',
          title: 'text-gray-800 font-semibold',
          content: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-2.5 font-medium'
        }
      });
      return;
    }

    if (documentName === initialData.documentName && type === initialData.type && !selectedFile) {
        Swal.fire({
          title: 'Tidak Ada Perubahan',
          text: 'Tidak ada perubahan data untuk disimpan.',
          icon: 'info',
          customClass: {
            popup: 'rounded-2xl shadow-2xl border border-white/50',
            title: 'text-gray-800 font-semibold',
            content: 'text-gray-600',
            confirmButton: 'rounded-xl px-6 py-2.5 font-medium'
          }
        });
        onClose();
        return;
    }

    setIsSaving(true);
    try {
      const result = await updateDocument(initialData.id!, documentName, type, base64String || undefined);
      Swal.fire({
        title: 'Sukses!',
        text: 'Dokumen berhasil diperbarui.',
        icon: 'success',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-white/50',
          title: 'text-gray-800 font-semibold',
          content: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-2.5 font-medium'
        }
      });
      
      const updatedDocData: DocumentData = {
        ...initialData,
        documentName: result.documentName || documentName,
        type: (result.type || type) as DocumentData['type'],
        fileUrl: result.fileUrl || initialData.fileUrl,
        updatedAt: new Date().toISOString(),
      };
      onUpdateSuccess(updatedDocData);
      onClose();
    } catch (err: any) {
      console.error("Failed to update document:", err);
      Swal.fire({
        title: 'Error',
        text: err.message || 'Gagal memperbarui dokumen.',
        icon: 'error',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-white/50',
          title: 'text-gray-800 font-semibold',
          content: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-2.5 font-medium'
        }
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden">
        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getTypeColor(type)}`}></div>
        
        {/* Background decoration */}
        <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-6 left-6 w-20 h-20 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-2xl"></div>
        
        {/* Header */}
        <div className="relative p-6 md:p-8 border-b border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-gradient-to-br ${getTypeColor(type)} rounded-2xl shadow-lg`}>
                <FileEdit size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Dokumen</h2>
                <p className="text-sm text-gray-600">Perbarui informasi dokumen Anda</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="group p-2.5 text-gray-400 hover:text-gray-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
              disabled={isSaving}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Document Name */}
          <div className="group">
            <label htmlFor="edit-doc-name" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Type size={14} className="text-white" />
              </div>
              Nama Dokumen
            </label>
            <div className="relative">
              <input
                type="text"
                id="edit-doc-name"
                value={documentName}
                onChange={(e) => {
                  setDocumentName(e.target.value);
                  if(errors.documentName) setErrors(prev => ({...prev, documentName: validateField('documentName', e.target.value)}))
                }}
                onBlur={(e) => setErrors(prev => ({...prev, documentName: validateField('documentName', e.target.value)}))}
                className={`w-full px-4 py-3 text-sm bg-white/70 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.documentName 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-white/50 hover:border-blue-300 focus:border-blue-500'
                }`}
                placeholder="Masukkan nama dokumen..."
                disabled={isSaving}
              />
              {errors.documentName && (
                <div className="absolute -bottom-5 left-0 text-xs text-red-500 font-medium">
                  {errors.documentName}
                </div>
              )}
            </div>
          </div>

          {/* Document Type */}
          <div className="group">
            <label htmlFor="edit-doc-type" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div className={`p-1.5 bg-gradient-to-br ${getTypeColor(type)} rounded-lg`}>
                <File size={14} className="text-white" />
              </div>
              Jenis Dokumen
            </label>
            <div className="relative">
              <select
                id="edit-doc-type"
                value={type}
                onChange={(e) => {
                  setType(e.target.value as DocumentData['type']);
                  if(errors.type) setErrors(prev => ({...prev, type: validateField('type', e.target.value)}))
                }}
                onBlur={(e) => setErrors(prev => ({...prev, type: validateField('type', e.target.value)}))}
                className={`w-full px-4 py-3 text-sm bg-white/70 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer ${
                  errors.type 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-white/50 hover:border-blue-300 focus:border-blue-500'
                }`}
                disabled={isSaving}
              >
                {documentTypes.map(option => (
                  <option key={option} value={option} className="py-2">
                    {option}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.type && (
                <div className="absolute -bottom-5 left-0 text-xs text-red-500 font-medium">
                  {errors.type}
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="group">
            <label htmlFor="edit-doc-file" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <UploadCloud size={14} className="text-white" />
              </div>
              Ganti File PDF (Opsional)
            </label>
            <div className="relative">
              <input
                type="file"
                id="edit-doc-file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={isSaving}
              />
              <div className={`w-full p-4 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                selectedFile 
                  ? 'border-green-400 bg-green-50/50' 
                  : 'border-gray-300 hover:border-green-400 bg-white/50'
              } hover:bg-green-50/30 cursor-pointer group-hover:border-green-400`}>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                        <UploadCloud size={20} className="text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {selectedFile ? 'File baru dipilih' : 'Pilih file PDF baru'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFile ? fileNameDisplay : 'Maks. 5MB • Format PDF'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {!selectedFile && (
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Sparkles size={12} />
                Biarkan kosong jika tidak ingin mengganti file
              </p>
            )}
          </div>
        </form>
        
        {/* Footer */}
        <div className="relative p-6 md:p-8 border-t border-white/20 bg-white/30 backdrop-blur-sm">
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white/70 hover:bg-white/90 rounded-2xl border border-white/50 hover:border-gray-300 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
              disabled={isSaving}
            >
              Batal
            </button>
            <button 
              type="submit" 
              onClick={() => document.querySelector<HTMLFormElement>('form')?.requestSubmit()} 
              className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold py-2.5 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                  Simpan Perubahan
                </>
              )}
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
            </button>
          </div>
        </div>

        {/* Subtle hover glow effect */}
        <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className={`absolute inset-0 bg-gradient-to-r ${getTypeColor(type)} opacity-5 rounded-3xl`}></div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
      `}</style>
    </div>
  );
};

export default EditDocumentForm;