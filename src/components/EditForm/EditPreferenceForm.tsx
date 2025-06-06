// src/components/EditForm/EditPreferenceForm.tsx
import React, { useState, useEffect } from 'react';
import { type PreferenceData, updatePreferences, validJobTypes, fetchMasterJobCategories, fetchMasterLocations, type JobType } from '../../services/PreferenceService';
import Swal from 'sweetalert2';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { Save, X, Target, MapPin, DollarSign, Briefcase } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';

interface EditPreferenceFormProps {
  initialData: PreferenceData;
  onClose: () => void;
  onUpdateSuccess: (updatedPreferences: PreferenceData) => void;
}

const EditPreferenceForm: React.FC<EditPreferenceFormProps> = ({ initialData, onClose, onUpdateSuccess }) => {
  const [jobCategories, setJobCategories] = useState<string[]>(initialData.jobCategories || []);
  const [locations, setLocations] = useState<string[]>(initialData.locations || []);
  const [salaryExpectation, setSalaryExpectation] = useState<number | null>(initialData.salaryExpectation || null);
  const [jobTypes, setJobTypes] = useState<JobType[]>(initialData.jobTypes || []);

  const [masterCategories, setMasterCategories] = useState<{ value: string; label: string; }[]>([]);
  const [masterLocations, setMasterLocations] = useState<{ value: string; label: string; }[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadMasterData = async () => {
      const catData = await fetchMasterJobCategories();
      const locData = await fetchMasterLocations();
      setMasterCategories(catData.map(c => ({ value: c, label: c })));
      setMasterLocations(locData.map(l => ({ value: l, label: l })));
    };
    loadMasterData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (jobCategories.length === 0 || locations.length === 0 || jobTypes.length === 0) {
      Swal.fire('Data Kurang Lengkap', 'Mohon isi setidaknya satu preferensi untuk setiap kategori, lokasi, dan jenis pekerjaan.', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Omit<PreferenceData, 'id' | 'createdAt' | 'updatedAt'>> = {
        jobCategories,
        locations,
        salaryExpectation,
        jobTypes,
      };
      await updatePreferences(payload);
      Swal.fire('Sukses!', 'Preferensi pekerjaan berhasil diperbarui.', 'success');
      onUpdateSuccess({ ...initialData, ...payload });
      onClose();
    } catch (err: any) {
      console.error("Failed to update preferences:", err);
      Swal.fire('Error', err.message || 'Gagal memperbarui preferensi pekerjaan.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const jobTypeOptions = validJobTypes.map(type => ({ value: type, label: type }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center"><Target size={24} className="mr-2 text-cyan-600" /> Edit Preferensi Pekerjaan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-2 flex-grow custom-scrollbar-modal">
          <div>
            <label htmlFor="jobCategories" className="block text-xs font-medium text-gray-700 mb-1 flex items-center"><Briefcase size={14} className="mr-1.5 text-cyan-600" />Kategori Pekerjaan</label>
            <CreatableSelect
              isMulti
              options={masterCategories}
              value={jobCategories.map(c => ({ value: c, label: c }))}
              onChange={(selected) => setJobCategories(selected.map(s => s.value))}
              placeholder="Pilih atau ketik kategori..."
              formatCreateLabel={(inputValue) => `Tambah "${inputValue}"`}
              isDisabled={isSaving}
            />
          </div>
          <div>
            <label htmlFor="locations" className="block text-xs font-medium text-gray-700 mb-1 flex items-center"><MapPin size={14} className="mr-1.5 text-cyan-600" />Lokasi</label>
            <CreatableSelect
              isMulti
              options={masterLocations}
              value={locations.map(l => ({ value: l, label: l }))}
              onChange={(selected) => setLocations(selected.map(s => s.value))}
              placeholder="Pilih atau ketik lokasi..."
              formatCreateLabel={(inputValue) => `Tambah "${inputValue}"`}
              isDisabled={isSaving}
            />
          </div>
           <div>
            <label htmlFor="jobTypes" className="block text-xs font-medium text-gray-700 mb-1 flex items-center"><Briefcase size={14} className="mr-1.5 text-cyan-600" />Jenis Pekerjaan</label>
            <Select
              isMulti
              options={jobTypeOptions}
              value={jobTypes.map(t => ({ value: t, label: t }))}
              onChange={(selected) => setJobTypes(selected.map(s => s.value as JobType))}
              placeholder="Pilih jenis pekerjaan..."
              closeMenuOnSelect={false}
              isDisabled={isSaving}
            />
          </div>
          <div>
             <label htmlFor="salaryExpectation" className="block text-xs font-medium text-gray-700 mb-1 flex items-center"><DollarSign size={14} className="mr-1.5 text-cyan-600" />Ekspektasi Gaji (Per Bulan)</label>
             <CurrencyInput
                id="salaryExpectation"
                name="salaryExpectation"
                placeholder="Contoh: 10.000.000"
                value={salaryExpectation || ''}
                onValueChange={(value) => setSalaryExpectation(value ? parseInt(value) : null)}
                prefix="Rp "
                groupSeparator="."
                decimalSeparator=","
                className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
                disabled={isSaving}
            />
          </div>
        </form>
        
        <div className="pt-5 border-t mt-auto flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition" disabled={isSaving}>Batal</button>
            <button type="submit" onClick={() => document.querySelector<HTMLFormElement>('form[class*="space-y-5"]')?.requestSubmit()} className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-5 rounded-lg transition flex items-center disabled:opacity-60" disabled={isSaving}>
              {isSaving ? <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Menyimpan...</> : <><Save size={16} className="mr-1.5" />Simpan Perubahan</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditPreferenceForm;
