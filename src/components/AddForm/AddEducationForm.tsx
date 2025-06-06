// src/components/AddForm/AddEducationForm.tsx
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { type EducationData, addEducation } from '../../services/EducationService';
import Swal from 'sweetalert2';
import { Save, X, Calendar, BookOpen, Briefcase, TrendingUp } from 'lucide-react';

interface AddEducationFormProps {
  onClose: () => void;
  onAddSuccess: (newEducation: EducationData) => void;
}

const educationLevels = ["SMA/SMK Sederajat", "Diploma (D1-D4)", "Sarjana (S1)", "Magister (S2)", "Doktor (S3)", "Lainnya"];

const AddEducationForm: React.FC<AddEducationFormProps> = ({ onClose, onAddSuccess }) => {
  const [formData, setFormData] = useState<Omit<EducationData, 'id' | 'createdAt' | 'updatedAt'>>({
    level: educationLevels[0],
    institution: '',
    major: '',
    startDate: '',
    endDate: '', // Initialize as empty string, can be null
    gpa: '',    // Initialize as empty string, can be null or number
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EducationData, string>>>({});

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
    (Object.keys(formData) as Array<keyof Omit<EducationData, 'id' | 'createdAt' | 'updatedAt'>>).forEach(key => {
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
    try {
      const educationPayload = {
        ...formData,
        gpa: formData.gpa ? parseFloat(formData.gpa as string) : null, // Convert GPA to number or null
        endDate: formData.endDate || null, // Ensure endDate is null if empty
      };
      const newEducation = await addEducation(educationPayload);
      Swal.fire('Sukses!', 'Riwayat pendidikan berhasil ditambahkan.', 'success');
      onAddSuccess(newEducation);
      onClose();
    } catch (err: any) {
      console.error("Failed to add education:", err);
      Swal.fire('Error', err.message || 'Gagal menambahkan riwayat pendidikan.', 'error');
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
    <div className="fixed inset-0  bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Tambah Riwayat Pendidikan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar-modal">
          {inputFields.map(field => (
            <div key={field.name}>
              <label htmlFor={`add-${field.name}`} className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                <field.icon size={14} className="mr-1.5 text-blue-600" />
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  id={`add-${field.name}`}
                  name={field.name}
                  value={formData[field.name] as string || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 text-sm rounded-md bg-gray-50 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm appearance-none`}
                  disabled={isSaving}
                >
                  {field.options?.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={`add-${field.name}`}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={ (field.type === 'date' && !formData[field.name]) ? '' : formData[field.name] as string || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 text-sm rounded-md bg-gray-50 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm`}
                  disabled={isSaving}
                  step={field.type === 'number' ? '0.01' : undefined}
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
          background: #f9fafb; /* bg-gray-50 */
          border-radius: 10px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb {
          background: #d1d5db; /* bg-gray-300 */
          border-radius: 10px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; /* bg-gray-400 */
        }
      `}</style>
    </div>
  );
};

export default AddEducationForm;
