// src/components/AddForm/AddDocumentForm.tsx
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { addDocument, documentTypes, type DocumentData } from '../../services/DocumentService';
import Swal from 'sweetalert2';
import { Save, X, FilePlus, Type, UploadCloud } from 'lucide-react';

interface AddDocumentFormProps {
  onClose: () => void;
  onAddSuccess: (newDocument: { documentId: string, fileUrl: string, documentName: string }) => void;
}

const AddDocumentForm: React.FC<AddDocumentFormProps> = ({ onClose, onAddSuccess }) => {
  const [documentName, setDocumentName] = useState('');
  const [type, setType] = useState<DocumentData['type']>(documentTypes[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState<string | null>(null);
  const [fileNameDisplay, setFileNameDisplay] = useState<string>('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<'documentName' | 'type' | 'file', string>>>({});

  const validateField = (name: 'documentName' | 'type' | 'file', value: any): string => {
    switch (name) {
      case 'documentName':
        return value && value.trim() !== '' ? '' : 'Nama Dokumen wajib diisi.';
      case 'type':
        return value && value.trim() !== '' ? '' : 'Jenis Dokumen wajib dipilih.';
      case 'file':
        return value ? '' : 'File wajib dipilih.';
      default:
        return '';
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        Swal.fire('Format Salah', 'Hanya file PDF yang diizinkan.', 'error');
        setSelectedFile(null);
        setBase64String(null);
        setFileNameDisplay('');
        e.target.value = ''; // Reset file input
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        Swal.fire('Ukuran Terlalu Besar', 'Ukuran file PDF maksimal 5MB.', 'error');
        setSelectedFile(null);
        setBase64String(null);
        setFileNameDisplay('');
        e.target.value = ''; // Reset file input
        return;
      }
      setSelectedFile(file);
      setFileNameDisplay(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBase64String(result.split(',')[1]); // Get only the base64 part
      };
      reader.readAsDataURL(file);
       if (errors.file) {
        setErrors(prev => ({...prev, file: ''}));
      }
    } else {
      setSelectedFile(null);
      setBase64String(null);
      setFileNameDisplay('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let formIsValid = true;
    const newErrors: Partial<Record<'documentName' | 'type' | 'file', string>> = {};
    newErrors.documentName = validateField('documentName', documentName);
    newErrors.type = validateField('type', type);
    newErrors.file = validateField('file', selectedFile);

    if (newErrors.documentName || newErrors.type || newErrors.file) {
        formIsValid = false;
    }
    setErrors(newErrors);

    if (!formIsValid || !base64String) {
      Swal.fire('Validasi Gagal', 'Mohon periksa kembali isian form Anda dan pastikan file telah dipilih.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const newDocument = await addDocument(documentName, type, base64String);
      Swal.fire('Sukses!', 'Dokumen berhasil diunggah.', 'success');
      onAddSuccess(newDocument);
      onClose();
    } catch (err: any) {
      console.error("Failed to upload document:", err);
      Swal.fire('Error', err.message || 'Gagal mengunggah dokumen.', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center"><FilePlus size={24} className="mr-2 text-green-600" /> Tambah Dokumen</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar-modal">
          <div>
            <label htmlFor="add-doc-name" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <Type size={14} className="mr-1.5 text-green-600" /> Nama Dokumen
            </label>
            <input
              type="text"
              id="add-doc-name"
              value={documentName}
              onChange={(e) => {
                setDocumentName(e.target.value);
                if(errors.documentName) setErrors(prev => ({...prev, documentName: validateField('documentName', e.target.value)}))
              }}
              onBlur={(e) => setErrors(prev => ({...prev, documentName: validateField('documentName', e.target.value)}))}
              placeholder="Contoh: CV Terbaru, Sertifikat React"
              className={`w-full px-3 py-2 text-sm rounded-md bg-gray-50 border ${errors.documentName ? 'border-red-500' : 'border-gray-300'} focus:border-green-500 focus:ring-1 focus:ring-green-500 transition`}
              disabled={isSaving}
            />
            {errors.documentName && <p className="text-xs text-red-500 mt-1">{errors.documentName}</p>}
          </div>

          <div>
            <label htmlFor="add-doc-type" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <Type size={14} className="mr-1.5 text-green-600" /> Jenis Dokumen
            </label>
            <select
              id="add-doc-type"
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
            <label htmlFor="add-doc-file" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <UploadCloud size={14} className="mr-1.5 text-green-600" /> Pilih File PDF (Maks. 5MB)
            </label>
            <input
              type="file"
              id="add-doc-file"
              accept=".pdf"
              onChange={handleFileChange}
              className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition file:cursor-pointer
                          border ${errors.file ? 'border-red-500' : 'border-gray-300'} rounded-lg p-0 focus-within:ring-1 focus-within:ring-green-500`}
              disabled={isSaving}
            />
             {fileNameDisplay && <p className="text-xs text-gray-600 mt-1">File terpilih: {fileNameDisplay}</p>}
             {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
          </div>
        </form>
        
        <div className="pt-5 border-t mt-auto flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition" disabled={isSaving}>Batal</button>
            <button type="submit" onClick={() => document.querySelector<HTMLFormElement>('form[class*="space-y-4"]')?.requestSubmit()} className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-5 rounded-lg transition flex items-center disabled:opacity-60" disabled={isSaving}>
              {isSaving ? <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Mengunggah...</> : <><Save size={16} className="mr-1.5" />Unggah Dokumen</>}
            </button>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar-modal::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-modal::-webkit-scrollbar-track { background: #f9fafb; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
};

export default AddDocumentForm;
