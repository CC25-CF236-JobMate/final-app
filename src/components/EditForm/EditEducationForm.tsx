// src/components/EditForm/EditEducationForm.tsx
import React, { useState, useEffect, type ChangeEvent,type FormEvent } from 'react';
import { type EducationData, updateEducation } from '../../services/EducationService';
import Swal from 'sweetalert2';
import { Save, X, Calendar, BookOpen, Briefcase, TrendingUp,  Sparkles, Edit3 } from 'lucide-react';

interface EditEducationFormProps {
  initialData: EducationData; // Existing data to edit
  onClose: () => void;
  onUpdateSuccess: (updatedEducation: EducationData) => void;
}

const educationLevels = ["SMA/SMK Sederajat", "Diploma (D1-D4)", "Sarjana (S1)", "Magister (S2)", "Doktor (S3)", "Lainnya"];

const EditEducationForm: React.FC<EditEducationFormProps> = ({ initialData, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<EducationData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EducationData, string>>>({});

  useEffect(() => {
    // Format dates for input type="date" if they exist
    // The backend sends them as YYYY-MM-DD strings which is fine for display
    // but input type="date" expects YYYY-MM-DD
    setFormData({
      ...initialData,
      startDate: initialData.startDate ? initialData.startDate.toString().split('T')[0] : '',
      endDate: initialData.endDate ? initialData.endDate.toString().split('T')[0] : '',
      gpa: initialData.gpa !== null && initialData.gpa !== undefined ? initialData.gpa.toString() : '',
    });
  }, [initialData]);

  const validateField = (name: keyof EducationData, value: any): string => {
    switch (name) {
      case 'level':
      case 'institution':
      case 'major':
      case 'startDate':
        return value && value.trim() !== '' ? '' : `${name === 'startDate' ? 'Tanggal Mulai' : name.charAt(0).toUpperCase() + name.slice(1)} wajib diisi.`;
      case 'endDate':
        if (value && formData.startDate && new Date(value) < new Date(formData.startDate)) {
          return 'Tanggal Selesai tidak boleh sebelum Tanggal Mulai.';
        }
        return '';
      case 'gpa':
        if (value && (isNaN(parseFloat(value)) || parseFloat(value) < 0 || parseFloat(value) > 4)) {
          return 'IPK harus antara 0 dan 4.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
     if (errors[name as keyof EducationData]) {
        setErrors(prev => ({...prev, [name]: validateField(name as keyof EducationData, value)}));
    }
  };

   const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({...prev, [name]: validateField(name as keyof EducationData, value)}));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formIsValid = true;
    const newErrors: Partial<Record<keyof EducationData, string>> = {};
    // Validate only fields present in formData (excluding id, createdAt, updatedAt)
    const fieldsToValidate: Array<keyof Omit<EducationData, 'id' | 'createdAt' | 'updatedAt'>> = 
      ['level', 'institution', 'major', 'startDate', 'endDate', 'gpa'];

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
          popup: 'rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20',
          title: 'text-gray-800 font-bold',
          content: 'text-gray-600',
          confirmButton: 'rounded-xl font-semibold'
        }
      });
      return;
    }
    
    setIsSaving(true);
    if (!formData.id) {
      Swal.fire({
        title: 'Error',
        text: 'ID Pendidikan tidak ditemukan untuk pembaruan.',
        icon: 'error',
        customClass: {
          popup: 'rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20',
          title: 'text-gray-800 font-bold',
          content: 'text-gray-600',
          confirmButton: 'rounded-xl font-semibold'
        }
      });
      setIsSaving(false);
      return;
    }

    try {
      // Prepare payload, exclude id, createdAt, updatedAt
      const { id, createdAt, updatedAt, ...payload } = formData;
      const updatePayload = {
        ...payload,
        gpa: payload.gpa ? parseFloat(payload.gpa as string) : null,
        endDate: payload.endDate || null,
      };

      const updatedEducation = await updateEducation(formData.id, updatePayload);
      Swal.fire({
        title: 'Sukses!',
        text: 'Riwayat pendidikan berhasil diperbarui.',
        icon: 'success',
        customClass: {
          popup: 'rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20',
          title: 'text-gray-800 font-bold',
          content: 'text-gray-600',
          confirmButton: 'rounded-xl font-semibold'
        }
      });
      onUpdateSuccess(updatedEducation); // Pass the full updated object from server
      onClose();
    } catch (err: any) {
      console.error("Failed to update education:", err);
      Swal.fire({
        title: 'Error',
        text: err.message || 'Gagal memperbarui riwayat pendidikan.',
        icon: 'error',
        customClass: {
          popup: 'rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20',
          title: 'text-gray-800 font-bold',
          content: 'text-gray-600',
          confirmButton: 'rounded-xl font-semibold'
        }
      });
    } finally {
      setIsSaving(false);
    }
  };

  const inputFields: Array<{name: keyof Omit<EducationData, 'id' | 'createdAt' | 'updatedAt'>, label: string, type: string, placeholder?: string, icon: React.ElementType, options?: string[]}> = [
    { name: 'level', label: 'Jenjang Pendidikan', type: 'select', icon: Briefcase, options: educationLevels },
    { name: 'institution', label: 'Nama Institusi/Sekolah', type: 'text', placeholder: 'Contoh: Universitas Indonesia', icon: BookOpen },
    { name: 'major', label: 'Jurusan/Program Studi', type: 'text', placeholder: 'Contoh: Teknik Informatika', icon: TrendingUp },
    { name: 'startDate', label: 'Tanggal Mulai', type: 'date', icon: Calendar },
    { name: 'endDate', label: 'Tanggal Selesai (Kosongkan jika masih berlangsung)', type: 'date', icon: Calendar },
    { name: 'gpa', label: 'IPK (Opsional)', type: 'number', placeholder: 'Contoh: 3.75', icon: TrendingUp },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/40 backdrop-blur-md flex justify-center items-center z-[100] p-4 animate-fade-in">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-300"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl animate-pulse delay-700"></div>
      
      <div className="relative bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/30 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-violet-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        
        <div className="relative z-10">
          {/* Enhanced Header */}
          <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
            <div className="flex items-center">
              <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mr-3">
                <Edit3 size={24} className="text-white" strokeWidth={1.5} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white/90 rounded-full flex items-center justify-center">
                  <Sparkles size={8} className="text-blue-500" />
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Edit Riwayat Pendidikan
                </h2>
                <p className="text-gray-500 text-xs mt-1">Perbarui informasi akademis Anda</p>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-white hover:bg-red-500/80 transition-all duration-300 rounded-xl hover:scale-110 hover:shadow-lg"
              disabled={isSaving}
            >
              <X size={20} />
            </button>
          </div>

          {/* Enhanced Form - Made Scrollable */}
          <div className="overflow-y-auto pr-2 flex-grow custom-scrollbar-modal max-h-[50vh]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {inputFields.map((field, index) => (
                <div 
                  key={field.name} 
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <label 
                    htmlFor={`edit-${field.name}`} 
                    className="block text-xs font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <div className="p-1.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg mr-2 border border-blue-200/30">
                      <field.icon size={12} className="text-blue-600" />
                    </div>
                    {field.label}
                  </label>
                  
                  <div className="relative group">
                    {field.type === 'select' ? (
                      <select
                        id={`edit-${field.name}`}
                        name={field.name}
                        value={formData[field.name] as string || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-3 text-sm rounded-xl bg-white/70 backdrop-blur-sm border-2 transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl group-hover:scale-[1.01] ${
                          errors[field.name] 
                            ? 'border-red-400/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-white/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-300'
                        }`}
                        disabled={isSaving}
                      >
                        {field.options?.map(option => 
                          <option key={option} value={option}>{option}</option>
                        )}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={`edit-${field.name}`}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={ (field.type === 'date' && !formData[field.name]) ? '' : formData[field.name] as string || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-3 text-sm rounded-xl bg-white/70 backdrop-blur-sm border-2 transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl group-hover:scale-[1.01] placeholder-gray-400 ${
                          errors[field.name] 
                            ? 'border-red-400/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-white/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-300'
                        }`}
                        disabled={isSaving}
                        step={field.type === 'number' ? '0.01' : undefined}
                      />
                    )}
                    
                    {/* Enhanced error display */}
                    {errors[field.name] && (
                      <div className="mt-2 p-2 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg">
                        <p className="text-xs text-red-600 font-medium flex items-center">
                          <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                          {errors[field.name]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </form>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="pt-5 border-t border-white/20 mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400/50 border border-white/30 hover:scale-105 hover:shadow-lg"
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit"
              onClick={() => document.querySelector<HTMLFormElement>('form[class*="space-y-4"]')?.requestSubmit()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-semibold py-2 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 flex items-center relative overflow-hidden"
              disabled={isSaving}
            >
              {/* Button gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex items-center">
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
                    Simpan
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .custom-scrollbar-modal::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6));
          border-radius: 12px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
        }
        
        /* Enhanced input focus effects */
        input:focus, select:focus {
          transform: translateY(-1px);
        }
        
        /* Smooth transitions for all interactive elements */
        * {
          transition-property: transform, box-shadow, background-color, border-color;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default EditEducationForm;