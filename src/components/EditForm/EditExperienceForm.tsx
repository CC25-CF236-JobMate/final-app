// src/components/EditForm/EditExperienceForm.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { type ExperienceData, updateExperience, validEmploymentTypes, type EmploymentType } from '../../services/ExperienceService';
import Swal from 'sweetalert2';
import { Save, X, Calendar, Briefcase, Building, FileText } from 'lucide-react';

interface EditExperienceFormProps {
  initialData: ExperienceData; // Existing data to edit
  onClose: () => void;
  onUpdateSuccess: (updatedExperience: ExperienceData) => void;
}

const employmentTypeLabels: Record<EmploymentType, string> = {
  'full-time': 'Penuh Waktu (Full-time)',
  'part-time': 'Paruh Waktu (Part-time)',
  contract: 'Kontrak (Contract)',
  internship: 'Magang (Internship)',
  freelance: 'Lepas (Freelance)',
};

const EditExperienceForm: React.FC<EditExperienceFormProps> = ({ initialData, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<ExperienceData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ExperienceData, string>>>({});

  useEffect(() => {
    setFormData({
      ...initialData,
      startDate: initialData.startDate ? initialData.startDate.toString().split('T')[0] : '',
      endDate: initialData.endDate ? initialData.endDate.toString().split('T')[0] : '',
    });
  }, [initialData]);
  
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
      Swal.fire('Validasi Gagal', 'Mohon periksa kembali isian form Anda.', 'error');
      return;
    }

    setIsSaving(true);
    if (!formData.id) {
      Swal.fire('Error', 'ID Pengalaman tidak ditemukan untuk pembaruan.', 'error');
      setIsSaving(false);
      return;
    }

    try {
      const { id, createdAt, updatedAt, ...payload } = formData;
      const updatePayload = {
        ...payload,
        endDate: payload.endDate || null,
      };

      const updatedExperience = await updateExperience(formData.id, updatePayload);
      Swal.fire('Sukses!', 'Pengalaman kerja berhasil diperbarui.', 'success');
      onUpdateSuccess(updatedExperience);
      onClose();
    } catch (err: any) {
      console.error("Failed to update experience:", err);
      Swal.fire('Error', err.message || 'Gagal memperbarui pengalaman kerja.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const inputFields: Array<{name: keyof Omit<ExperienceData, 'id'|'createdAt'|'updatedAt'>, label: string, type: 'text' | 'select' | 'textarea' | 'date', placeholder?: string, icon: React.ElementType, options?: readonly EmploymentType[]}> = [
    { name: 'position', label: 'Posisi', type: 'text', placeholder: 'Contoh: Software Engineer', icon: Briefcase },
    { name: 'company', label: 'Nama Perusahaan', type: 'text', placeholder: 'Contoh: PT Teknologi Maju', icon: Building },
    { name: 'employmentType', label: 'Jenis Pekerjaan', type: 'select', icon: Briefcase, options: validEmploymentTypes },
    { name: 'startDate', label: 'Tanggal Mulai', type: 'date', icon: Calendar },
    { name: 'endDate', label: 'Tanggal Selesai (Kosongkan jika masih bekerja)', type: 'date', icon: Calendar },
    { name: 'description', label: 'Deskripsi Pekerjaan', type: 'textarea', placeholder: 'Jelaskan tanggung jawab dan pencapaian Anda...', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Edit Pengalaman Kerja</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar-modal">
          {inputFields.map(field => (
            <div key={field.name}>
              <label htmlFor={`edit-exp-${field.name}`} className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                <field.icon size={14} className="mr-1.5 text-blue-600" />
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  id={`edit-exp-${field.name}`}
                  name={field.name}
                  value={formData[field.name] as string || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 text-sm rounded-md bg-gray-50 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm appearance-none`}
                  disabled={isSaving}
                >
                  {field.options?.map(option => <option key={option} value={option}>{employmentTypeLabels[option as EmploymentType]}</option>)}
                </select>
              ) : field.type === 'textarea' ? (
                 <textarea
                  id={`edit-exp-${field.name}`}
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
                  type={field.type}
                  id={`edit-exp-${field.name}`}
                  name={field.name}
                  placeholder={field.placeholder}
                   value={ (field.type === 'date' && !formData[field.name]) ? '' : formData[field.name] as string || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 text-sm rounded-md bg-gray-50 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm`}
                  disabled={isSaving}
                />
              )}
              {errors[field.name] && <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>}
            </div>
          ))}
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
                  Simpan
                </>
              )}
            </button>
          </div>
      </div>
      <style >{`
        .custom-scrollbar-modal::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-track {
          background: #f9fafb;
          border-radius: 10px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default EditExperienceForm;
