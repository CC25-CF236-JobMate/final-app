// src/components/EditForm/EditPortfolioForm.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { type PortfolioProject, updatePortfolioProject } from '../../services/PortfolioService';
import Swal from 'sweetalert2';
import { Save, X, Link as LinkIcon, FileText, Layers, Tag } from 'lucide-react';

interface EditPortfolioFormProps {
  initialData: PortfolioProject;
  onClose: () => void;
  onUpdateSuccess: (updatedProject: PortfolioProject) => void;
}

const EditPortfolioForm: React.FC<EditPortfolioFormProps> = ({ initialData, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<PortfolioProject>(initialData);
  const [techInput, setTechInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PortfolioProject, string>>>({});

  useEffect(() => {
    setFormData(initialData);
    setTechInput(initialData.technologies?.join(', ') || '');
  }, [initialData]);
  
  const validateField = (name: keyof PortfolioProject, value: any): string => {
    switch (name) {
      case 'title':
        return value && value.trim() !== '' ? '' : 'Judul Proyek wajib diisi.';
      case 'projectUrl':
        if (value && !/^(ftp|http|https):\/\/[^ "]+$/.test(value)) {
            return 'Format URL Proyek tidak valid.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
     if (errors[name as keyof PortfolioProject]) {
        setErrors(prev => ({...prev, [name]: validateField(name as keyof PortfolioProject, value)}));
    }
  };

  const handleTechInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTechInput(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({...prev, [name]: validateField(name as keyof PortfolioProject, value)}));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formIsValid = true;
    const newErrors: Partial<Record<keyof PortfolioProject, string>> = {};
    const fieldsToValidate: Array<keyof Omit<PortfolioProject, 'id'|'createdAt'|'updatedAt'|'technologies'>> = ['title', 'projectUrl', 'description'];

    fieldsToValidate.forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) {
            newErrors[key] = error;
            formIsValid = false;
        }
    });
     if (formData.projectUrl) {
        const urlError = validateField('projectUrl', formData.projectUrl);
        if (urlError) {
            newErrors['projectUrl'] = urlError;
            formIsValid = false;
        }
    }
    setErrors(newErrors);

    if (!formIsValid) {
      Swal.fire('Validasi Gagal', 'Mohon periksa kembali isian form Anda.', 'error');
      return;
    }

    setIsSaving(true);
    if (!formData.id) {
      Swal.fire('Error', 'ID Proyek tidak ditemukan untuk pembaruan.', 'error');
      setIsSaving(false);
      return;
    }

    try {
      const technologiesArray = techInput.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
      const { id, createdAt, updatedAt, ...payload } = formData;
      const updatePayload = {
        ...payload,
        technologies: technologiesArray,
      };

      const updatedProjectResult = await updatePortfolioProject(formData.id, updatePayload);
      Swal.fire('Sukses!', 'Proyek portfolio berhasil diperbarui.', 'success');
      // Backend PATCH might only return updatedFields or a simple message.
      // For UI consistency, merge initialData with the payload sent for update.
      // If backend returns the full updated object, use that instead.
      onUpdateSuccess({ ...initialData, ...updatePayload, id: formData.id }); 
      onClose();
    } catch (err: any) {
      console.error("Failed to update portfolio project:", err);
      Swal.fire('Error', err.message || 'Gagal memperbarui proyek portfolio.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const inputFields: Array<{name: keyof Omit<PortfolioProject, 'id'|'createdAt'|'updatedAt'|'technologies'>, label: string, type: 'text' | 'textarea' | 'url', placeholder?: string, icon: React.ElementType}> = [
    { name: 'title', label: 'Judul Proyek', type: 'text', placeholder: 'Contoh: Aplikasi Manajemen Tugas', icon: Layers },
    { name: 'projectUrl', label: 'URL Proyek (Opsional)', type: 'url', placeholder: 'https://proyek-saya.com', icon: LinkIcon },
    { name: 'description', label: 'Deskripsi Proyek (Opsional)', type: 'textarea', placeholder: 'Jelaskan tentang proyek Anda...', icon: FileText },
  ];

  return (
    <div className="fixed inset-0  bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center"><Layers size={24} className="mr-2 text-indigo-600" /> Edit Proyek Portfolio</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar-modal">
          {inputFields.map(field => (
            <div key={field.name}>
              <label htmlFor={`edit-portfolio-${field.name}`} className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                <field.icon size={14} className="mr-1.5 text-indigo-600" />
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                 <textarea
                  id={`edit-portfolio-${field.name}`}
                  name={field.name}
                  rows={4}
                  placeholder={field.placeholder}
                  value={formData[field.name] as string || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 text-sm rounded-md bg-gray-50 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm`}
                  disabled={isSaving}
                />
              ) : (
                <input
                  type={field.type === 'url' ? 'text' : field.type}
                  id={`edit-portfolio-${field.name}`}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] as string || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 text-sm rounded-md bg-gray-50 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm`}
                  disabled={isSaving}
                />
              )}
              {errors[field.name] && <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>}
            </div>
          ))}
           <div>
              <label htmlFor="edit-portfolio-technologies" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                <Tag size={14} className="mr-1.5 text-indigo-600" />
                Teknologi yang Digunakan (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                id="edit-portfolio-technologies"
                name="technologies"
                placeholder="Contoh: React, Node.js, Firebase"
                value={techInput}
                onChange={handleTechInputChange}
                className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
                disabled={isSaving}
              />
            </div>
        </form>
        
        <div className="pt-5 border-t mt-auto flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit"
              onClick={() => document.querySelector<HTMLFormElement>('form[class*="space-y-4"]')?.requestSubmit()}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-5 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed shadow-md flex items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1.5" />
                  Simpan Perubahan
                </>
              )}
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

export default EditPortfolioForm;
