// src/components/EditForm/EditDocumentForm.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { type DocumentData, updateDocument, documentTypes } from '../../services/DocumentService';
import Swal from 'sweetalert2';
import { Save, X, FileEdit, Type, UploadCloud } from 'lucide-react';

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
    setSelectedFile(null); // Reset file state on initial load or when initialData changes
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        Swal.fire('Format Salah', 'Hanya file PDF yang diizinkan.', 'error');
        setSelectedFile(null); setBase64String(null); setFileNameDisplay(''); e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        Swal.fire('Ukuran Terlalu Besar', 'Ukuran file PDF maksimal 5MB.', 'error');
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
      Swal.fire('Validasi Gagal', 'Mohon periksa kembali isian form Anda.', 'error');
      return;
    }
    // Check if anything actually changed besides potentially the file
    if (documentName === initialData.documentName && type === initialData.type && !selectedFile) {
        Swal.fire('Tidak Ada Perubahan', 'Tidak ada perubahan data untuk disimpan.', 'info');
        onClose();
        return;
    }

    setIsSaving(true);
    try {
      const result = await updateDocument(initialData.id!, documentName, type, base64String || undefined);
      Swal.fire('Sukses!', 'Dokumen berhasil diperbarui.', 'success');
      // Construct the updated data for callback, prioritize new URL if file was changed
      const updatedDocData: DocumentData = {
        ...initialData,
        documentName: result.documentName || documentName,
        type: (result.type || type) as DocumentData['type'],
        fileUrl: result.fileUrl || initialData.fileUrl, // Use new URL if backend returned it, else old one
        updatedAt: new Date().toISOString(), // Estimate updatedAt
      };
      onUpdateSuccess(updatedDocData);
      onClose();
    } catch (err: any) {
      console.error("Failed to update document:", err);
      Swal.fire('Error', err.message || 'Gagal memperbarui dokumen.', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="fixed inset-0  bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center"><FileEdit size={24} className="mr-2 text-green-600" /> Edit Dokumen</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar-modal">
          <div>
            <label htmlFor="edit-doc-name" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <Type size={14} className="mr-1.5 text-green-600" /> Nama Dokumen
            </label>
            <input
              type="text"
              id="edit-doc-name"
              value={documentName}
              onChange={(e) => {
                setDocumentName(e.target.value);
                if(errors.documentName) setErrors(prev => ({...prev, documentName: validateField('documentName', e.target.value)}))
              }}
              onBlur={(e) => setErrors(prev => ({...prev, documentName: validateField('documentName', e.target.value)}))}
              className={`w-full px-3 py-2 text-sm rounded-md bg-gray-50 border ${errors.documentName ? 'border-red-500' : 'border-gray-300'} focus:border-green-500 focus:ring-1 focus:ring-green-500 transition`}
              disabled={isSaving}
            />
            {errors.documentName && <p className="text-xs text-red-500 mt-1">{errors.documentName}</p>}
          </div>

          <div>
            <label htmlFor="edit-doc-type" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <Type size={14} className="mr-1.5 text-green-600" /> Jenis Dokumen
            </label>
            <select
              id="edit-doc-type"
              value={type}
              onChange={(e) => {
                setType(e.target.value as DocumentData['type']);
                if(errors.type) setErrors(prev => ({...prev, type: validateField('type', e.target.value)}))
              }}
              onBlur={(e) => setErrors(prev => ({...prev, type: validateField('type', e.target.value)}))}
              className={`w-full px-3 py-2 text-sm rounded-md bg-gray-50 border ${errors.type ? 'border-red-500' : 'border-gray-300'} focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none transition`}
              disabled={isSaving}
            >
              {documentTypes.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
             {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
          </div>

          <div>
            <label htmlFor="edit-doc-file" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <UploadCloud size={14} className="mr-1.5 text-green-600" /> Ganti File PDF (Opsional, Maks. 5MB)
            </label>
            <input
              type="file"
              id="edit-doc-file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition file:cursor-pointer
                          border border-gray-300 rounded-lg p-0 focus-within:ring-1 focus-within:ring-green-500"
              disabled={isSaving}
            />
            {fileNameDisplay && <p className="text-xs text-gray-600 mt-1">File baru dipilih: {fileNameDisplay}</p>}
            {!fileNameDisplay && <p className="text-xs text-gray-400 mt-1">Biarkan kosong jika tidak ingin mengganti file.</p>}
          </div>
        </form>
        
        <div className="pt-5 border-t mt-auto flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition" disabled={isSaving}>Batal</button>
            <button type="submit" onClick={() => document.querySelector<HTMLFormElement>('form[class*="space-y-4"]')?.requestSubmit()} className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-5 rounded-lg transition flex items-center disabled:opacity-60" disabled={isSaving}>
              {isSaving ? <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Menyimpan...</> : <><Save size={16} className="mr-1.5" />Simpan Perubahan</>}
            </button>
        </div>
      </div>
      <style>{`
        .custom-scrollbar-modal::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-modal::-webkit-scrollbar-track { background: #f9fafb; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
};

export default EditDocumentForm;
