// src/components/AddForm/AddPortfolioForm.tsx
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { type PortfolioProject, addPortfolioProject } from '../../services/PortfolioService';
import Swal from 'sweetalert2';
import { Save, X, Link as LinkIcon, FileText, Layers, Tag, Sparkles, PlusCircle } from 'lucide-react';

interface AddPortfolioFormProps {
  onClose: () => void;
  onAddSuccess: (newProject: PortfolioProject) => void;
}

const AddPortfolioForm: React.FC<AddPortfolioFormProps> = ({ onClose, onAddSuccess }) => {
  const [formData, setFormData] = useState<Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    projectUrl: '',
    technologies: [],
  });
  const [techInput, setTechInput] = useState(''); // For comma-separated input
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PortfolioProject, string>>>({});

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
    (Object.keys(formData) as Array<keyof Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt' | 'technologies'>>).forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) {
            newErrors[key] = error;
            formIsValid = false;
        }
    });
    // Validate projectUrl specifically if it's filled
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
    try {
      const technologiesArray = techInput.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
      const payload = {
        ...formData,
        technologies: technologiesArray,
      };
      const newProject = await addPortfolioProject(payload);
      Swal.fire({
        title: 'Sukses!',
        text: 'Proyek portfolio berhasil ditambahkan.',
        icon: 'success',
        background: 'rgba(255, 255, 255, 0.95)',
        backdrop: 'rgba(0, 0, 0, 0.4)',
        customClass: { 
          popup: 'rounded-2xl shadow-2xl backdrop-blur-sm border border-white/50',
          confirmButton: 'rounded-xl font-medium'
        }
      });
      onAddSuccess(newProject);
      onClose();
    } catch (err: any) {
      console.error("Failed to add portfolio project:", err);
      Swal.fire({
        title: 'Error',
        text: err.message || 'Gagal menambahkan proyek portfolio.',
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
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      <div className="relative group">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-pink-500/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col border border-white/50">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mr-4 shadow-lg">
                <PlusCircle size={28} className="text-white" strokeWidth={2}/>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Tambah Proyek Portfolio
                </h2>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <Sparkles size={14} className="mr-1 text-purple-400" />
                  Wujudkan karya terbaik Anda
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
                <label htmlFor={`add-portfolio-${field.name}`} className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <div className="p-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg mr-3">
                    <field.icon size={16} className="text-purple-600" />
                  </div>
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={`add-portfolio-${field.name}`}
                    name={field.name}
                    rows={4}
                    placeholder={field.placeholder}
                    value={formData[field.name] as string || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 text-sm rounded-xl bg-white/70 backdrop-blur-sm border-2 ${
                      errors[field.name] 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200/50 focus:border-purple-400 focus:ring-purple-200/50'
                    } focus:ring-4 transition-all duration-300 shadow-lg hover:shadow-xl placeholder-gray-400 resize-none`}
                    disabled={isSaving}
                  />
                ) : (
                  <input
                    type={field.type === 'url' ? 'text' : field.type}
                    id={`add-portfolio-${field.name}`}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] as string || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 text-sm rounded-xl bg-white/70 backdrop-blur-sm border-2 ${
                      errors[field.name] 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200/50 focus:border-purple-400 focus:ring-purple-200/50'
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
              <label htmlFor="add-portfolio-technologies" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <div className="p-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg mr-3">
                  <Tag size={16} className="text-purple-600" />
                </div>
                Teknologi yang Digunakan
                <span className="text-xs text-gray-500 ml-2">(Pisahkan dengan koma)</span>
              </label>
              <input
                type="text"
                id="add-portfolio-technologies"
                name="technologies"
                placeholder="Contoh: React, Node.js, Firebase, Tailwind CSS"
                value={techInput}
                onChange={handleTechInputChange}
                className="w-full px-4 py-3 text-sm rounded-xl bg-white/70 backdrop-blur-sm border-2 border-gray-200/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 shadow-lg hover:shadow-xl placeholder-gray-400"
                disabled={isSaving}
              />
              {/* Live preview of technologies */}
              {techInput.trim() && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 mr-2">Preview:</span>
                  {techInput.split(',').map((tech, index) => tech.trim() && (
                    <span 
                      key={index} 
                      className="inline-flex items-center text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 px-3 py-1.5 rounded-full border border-blue-200/50 font-medium"
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
              className="group relative bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm font-semibold py-3 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300/50 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 flex items-center overflow-hidden"
              disabled={isSaving}
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
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
                  <span className="relative z-10">Simpan Proyek</span>
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
          background: linear-gradient(to bottom, #a855f7, #ec4899); 
          border-radius: 10px; 
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(to bottom, #9333ea, #db2777); 
        }
      `}</style>
    </div>
  );
};

export default AddPortfolioForm;