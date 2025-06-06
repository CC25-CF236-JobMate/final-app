// src/components/AddForm/AddExperienceForm.tsx
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { type ExperienceData, addExperience, validEmploymentTypes, type EmploymentType } from '../../services/ExperienceService';
import Swal from 'sweetalert2';
import { Save, X, Calendar, Briefcase, Building, FileText, Clock, Star, Sparkles } from 'lucide-react';

interface AddExperienceFormProps {
  onClose: () => void;
  onAddSuccess: (newExperience: ExperienceData) => void;
}

const employmentTypeLabels: Record<EmploymentType, string> = {
  'full-time': 'Penuh Waktu (Full-time)',
  'part-time': 'Paruh Waktu (Part-time)',
  contract: 'Kontrak (Contract)',
  internship: 'Magang (Internship)',
  freelance: 'Lepas (Freelance)',
};

const getEmploymentTypeStyle = (type: EmploymentType) => {
  const styles: Record<EmploymentType, string> = {
    'full-time': 'from-green-500 to-emerald-600',
    'part-time': 'from-blue-500 to-cyan-600',
    contract: 'from-purple-500 to-violet-600',
    internship: 'from-orange-500 to-amber-600',
    freelance: 'from-pink-500 to-rose-600',
  };
  return styles[type] || 'from-gray-500 to-gray-600';
};

const AddExperienceForm: React.FC<AddExperienceFormProps> = ({ onClose, onAddSuccess }) => {
  const [formData, setFormData] = useState<Omit<ExperienceData, 'id' | 'createdAt' | 'updatedAt'>>({
    position: '',
    company: '',
    description: '',
    employmentType: validEmploymentTypes[0], // Default to first valid type
    startDate: '',
    endDate: '', 
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ExperienceData, string>>>({});

  const validateField = (name: keyof ExperienceData, value: any): string => {
    switch (name) {
      case 'position':
      case 'company':
      case 'description':
      case 'employmentType':
      case 'startDate':
        return value && value.toString().trim() !== '' ? '' : `${name === 'startDate' ? 'Tanggal Mulai' : name.charAt(0).toUpperCase() + name.slice(1)} wajib diisi.`;
      case 'endDate':
        if (value && formData.startDate && new Date(value) < new Date(formData.startDate)) {
          return 'Tanggal Selesai tidak boleh sebelum Tanggal Mulai.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ExperienceData]) {
        setErrors(prev => ({...prev, [name]: validateField(name as keyof ExperienceData, value)}));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({...prev, [name]: validateField(name as keyof ExperienceData, value)}));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let formIsValid = true;
    const newErrors: Partial<Record<keyof ExperienceData, string>> = {};
    const fieldsToValidate: Array<keyof Omit<ExperienceData, 'id'|'createdAt'|'updatedAt'>> = 
      ['position', 'company', 'description', 'employmentType', 'startDate', 'endDate'];

    fieldsToValidate.forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) {
            newErrors[key] = error;
            formIsValid = false;
        }
    });
    setErrors(newErrors);

    if (!formIsValid) {
      Swal.fire({
        title: 'Validasi Gagal',
        text: 'Mohon periksa kembali isian form Anda.',
        icon: 'error',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800',
          confirmButton: 'rounded-xl px-6 py-3 font-semibold'
        },
        buttonsStyling: false
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        endDate: formData.endDate || null, // Ensure endDate is null if empty
      };
      const newExperience = await addExperience(payload);
      Swal.fire({
        title: 'Sukses!',
        text: 'Pengalaman kerja berhasil ditambahkan.',
        icon: 'success',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800',
          confirmButton: 'rounded-xl px-6 py-3 font-semibold'
        },
        buttonsStyling: false
      });
      onAddSuccess(newExperience);
      onClose();
    } catch (err: any) {
      console.error("Failed to add experience:", err);
      Swal.fire({
        title: 'Error',
        text: err.message || 'Gagal menambahkan pengalaman kerja.',
        icon: 'error',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-800',
          confirmButton: 'rounded-xl px-6 py-3 font-semibold'
        },
        buttonsStyling: false
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const inputFields: Array<{name: keyof Omit<ExperienceData, 'id'|'createdAt'|'updatedAt'>, label: string, type: 'text' | 'select' | 'textarea' | 'date', placeholder?: string, icon: React.ElementType, options?: readonly EmploymentType[]}> = [
    { name: 'position', label: 'Posisi', type: 'text', placeholder: 'Contoh: Software Engineer', icon: Briefcase },
    { name: 'company', label: 'Nama Perusahaan', type: 'text', placeholder: 'Contoh: PT Teknologi Maju', icon: Building },
    { name: 'employmentType', label: 'Jenis Pekerjaan', type: 'select', icon: Clock, options: validEmploymentTypes },
    { name: 'startDate', label: 'Tanggal Mulai', type: 'date', icon: Calendar },
    { name: 'endDate', label: 'Tanggal Selesai (Kosongkan jika masih bekerja)', type: 'date', icon: Calendar },
    { name: 'description', label: 'Deskripsi Pekerjaan', type: 'textarea', placeholder: 'Jelaskan tanggung jawab dan pencapaian Anda...', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-white/50">
        {/* Gradient border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 blur"></div>
        
        <div className="relative">
          {/* Enhanced Header */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200/50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Briefcase size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                  Tambah Pengalaman Kerja
                  <Sparkles size={20} className="ml-2 text-yellow-500" />
                </h2>
                <p className="text-gray-600 text-sm mt-1">Bagikan riwayat pengalaman profesional Anda</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-all duration-300 p-2 rounded-xl hover:bg-gray-100/50 hover:scale-110 transform"
            >
              <X size={24} />
            </button>
          </div>

          {/* Enhanced Form - Made Scrollable */}
          <div className="overflow-y-auto pr-2 flex-grow custom-scrollbar-modal max-h-[50vh]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {inputFields.map((field, index) => (
                <div key={field.name} className="group">
                  <label 
                    htmlFor={`add-exp-${field.name}`} 
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <field.icon size={16} className="text-white" />
                    </div>
                    {field.label}
                  </label>
                  
                  {field.type === 'select' ? (
                    <div className="relative">
                      <select
                        id={`add-exp-${field.name}`}
                        name={field.name}
                        value={formData[field.name] as string || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 text-sm rounded-xl bg-gradient-to-r from-gray-50 to-white border-2 ${
                          errors[field.name] 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                        } focus:ring-4 transition-all duration-300 shadow-sm hover:shadow-md appearance-none cursor-pointer`}
                        disabled={isSaving}
                      >
                        {field.options?.map(option => (
                          <option key={option} value={option}>
                            {employmentTypeLabels[option as EmploymentType]}
                          </option>
                        ))}
                      </select>
                      {/* Custom select arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={`add-exp-${field.name}`}
                      name={field.name}
                      rows={4}
                      placeholder={field.placeholder}
                      value={formData[field.name] as string || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 text-sm rounded-xl bg-gradient-to-r from-gray-50 to-white border-2 ${
                        errors[field.name] 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                      } focus:ring-4 transition-all duration-300 shadow-sm hover:shadow-md resize-none`}
                      disabled={isSaving}
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={`add-exp-${field.name}`}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={(field.type === 'date' && !formData[field.name]) ? '' : formData[field.name] as string || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 text-sm rounded-xl bg-gradient-to-r from-gray-50 to-white border-2 ${
                        errors[field.name] 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                      } focus:ring-4 transition-all duration-300 shadow-sm hover:shadow-md`}
                      disabled={isSaving}
                    />
                  )}
                  
                  {errors[field.name] && (
                    <p className="text-sm text-red-500 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </form>
          </div>
          
          {/* Enhanced Footer */}
          <div className="pt-6 border-t border-gray-200/50 mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit"
              onClick={() => document.querySelector<HTMLFormElement>('form[class*="space-y-6"]')?.requestSubmit()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Simpan Pengalaman
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
          background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
          border-radius: 10px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #d1d5db, #9ca3af);
          border-radius: 10px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9ca3af, #6b7280);
        }
      `}</style>
    </div>
  );
};

export default AddExperienceForm;