// src/components/EditForm/EditPortfolioForm.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { type PortfolioProject, updatePortfolioProject } from '../../services/PortfolioService';
import Swal from 'sweetalert2';
import { Save, X, Link as LinkIcon, FileText, Layers, Tag, Sparkles, Edit3 } from 'lucide-react';

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
      Swal.fire({
        title: 'Validasi Gagal',
        text: 'Mohon periksa kembali isian form Anda.',
        icon: 'error',
        background: 'rgba(255, 255, 255, 0.95)',
        backdrop: 'rgba(0, 0, 0, 0.4)',
        customClass: { 
          popup: 'rounded-2xl shadow-2xl backdrop-blur-sm border border-white/50',
          confirmButton: 'rounded-xl font-medium'
        }
      });
      return;
    }

    setIsSaving(true);
    if (!formData.id) {
      Swal.fire({
        title: 'Error',
        text: 'ID Proyek tidak ditemukan untuk pembaruan.',
        icon: 'error',
        background: 'rgba(255, 255, 255, 0.95)',
        backdrop: 'rgba(0, 0, 0, 0.4)',
        customClass: { 
          popup: 'rounded-2xl shadow-2xl backdrop-blur-sm border border-white/50',
          confirmButton: 'rounded-xl font-medium'
        }
      });
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
      Swal.fire({
        title: 'Sukses!',
        text: 'Proyek portfolio berhasil diperbarui.',
        icon: 'success',
        background: 'rgba(255, 255, 255, 0.95)',
        backdrop: 'rgba(0, 0, 0, 0.4)',
        customClass: { 
          popup: 'rounded-2xl shadow-2xl backdrop-blur-sm border border-white/50',
          confirmButton: 'rounded-xl font-medium'
        }
      });
      // Backend PATCH might only return updatedFields or a simple message.
      // For UI consistency, merge initialData with the payload sent for update.
      // If backend returns the full updated object, use that instead.
      onUpdateSuccess({ ...initialData, ...updatePayload, id: formData.id }); 
      onClose();
    } catch (err: any) {
      console.error("Failed to update portfolio project:", err);
      Swal.fire({
        title: 'Error',
        text: err.message || 'Gagal memperbarui proyek portfolio.',
        icon: 'error',
        background: 'rgba(255, 255, 255, 0.95)',
        backdrop: 'rgba(0, 0, 0, 0.4)',
        customClass: { 
          popup: 'rounded-2xl shadow-2xl backdrop-blur-sm border border-white/50',
          confirmButton: 'rounded-xl font-medium'
        }
      });
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[100] p-4">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      <div className="relative group">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-green-500/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col border border-white/50">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-green-600 rounded-2xl mr-4 shadow-lg">
                <Edit3 size={28} className="text-white" strokeWidth={2}/>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Edit Proyek Portfolio
                </h2>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <Sparkles size={14} className="mr-1 text-blue-400" />
                  Perbarui karya terbaik Anda
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-300 rounded-xl hover:scale-110"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2 flex-grow custom-scrollbar-modal">
            {inputFields.map(field => (
              <div key={field.name} className="group">
                <label htmlFor={`edit-portfolio-${field.name}`} className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg mr-3">
                    <field.icon size={16} className="text-blue-600" />
                  </div>
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
                    className={`w-full px-4 py-3 text-sm rounded-xl bg-white/70 backdrop-blur-sm border-2 ${
                      errors[field.name] 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200/50 focus:border-blue-400 focus:ring-blue-200/50'
                    } focus:ring-4 transition-all duration-300 shadow-lg hover:shadow-xl placeholder-gray-400 resize-none`}
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
                    className={`w-full px-4 py-3 text-sm rounded-xl bg-white/70 backdrop-blur-sm border-2 ${
                      errors[field.name] 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200/50 focus:border-blue-400 focus:ring-blue-200/50'
                    } focus:ring-4 transition-all duration-300 shadow-lg hover:shadow-xl placeholder-gray-400`}
                    disabled={isSaving}
                  />
                )}
                {errors[field.name] && (
                  <p className="text-sm text-red-500 mt-2 flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
            
            {/* Technologies Input */}
            <div className="group">
              <label htmlFor="edit-portfolio-technologies" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <div className="p-2 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg mr-3">
                  <Tag size={16} className="text-blue-600" />
                </div>
                Teknologi yang Digunakan
                <span className="text-xs text-gray-500 ml-2">(Pisahkan dengan koma)</span>
              </label>
              <input
                type="text"
                id="edit-portfolio-technologies"
                name="technologies"
                placeholder="Contoh: React, Node.js, Firebase, Tailwind CSS"
                value={techInput}
                onChange={handleTechInputChange}
                className="w-full px-4 py-3 text-sm rounded-xl bg-white/70 backdrop-blur-sm border-2 border-gray-200/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl placeholder-gray-400"
                disabled={isSaving}
              />
              {/* Live preview of technologies */}
              {techInput.trim() && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 mr-2">Preview:</span>
                  {techInput.split(',').map((tech, index) => tech.trim() && (
                    <span 
                      key={index} 
                      className="inline-flex items-center text-xs bg-gradient-to-r from-blue-50 to-green-50 text-gray-800 px-3 py-1.5 rounded-full border border-blue-200/50 font-medium"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </form>
          
          {/* Footer Buttons */}
          <div className="pt-6 border-t border-gray-200/50 mt-auto flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-100/80 hover:bg-gray-200/80 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300/50 backdrop-blur-sm border border-gray-200/50 hover:scale-105"
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit"
              onClick={() => document.querySelector<HTMLFormElement>('form[class*="space-y-6"]')?.requestSubmit()}
              className="group relative bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white text-sm font-semibold py-3 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300/50 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 flex items-center overflow-hidden"
              disabled={isSaving}
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="relative z-10">Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10">Simpan Perubahan</span>
                  <Sparkles size={14} className="ml-2 relative z-10 animate-pulse" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar-modal::-webkit-scrollbar { 
          width: 8px; 
        }
        .custom-scrollbar-modal::-webkit-scrollbar-track { 
          background: rgba(243, 244, 246, 0.3); 
          border-radius: 10px; 
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #3b82f6, #10b981); 
          border-radius: 10px; 
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(to bottom, #2563eb, #059669); 
        }
      `}</style>
    </div>
  );
};

export default EditPortfolioForm;