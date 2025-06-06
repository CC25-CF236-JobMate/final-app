// src/components/AddForm/AddPreferenceForm.tsx
import React, { useState, useEffect } from 'react';
import {type PreferenceData, setPreferences, validJobTypes, fetchMasterJobCategories, fetchMasterLocations, type JobType } from '../../services/PreferenceService';
import Swal from 'sweetalert2';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { Save, X, Target, MapPin, DollarSign, Briefcase, CheckCircle, Sparkles } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';

interface AddPreferenceFormProps {
  onClose: () => void;
  onSaveSuccess: (newPreferences: PreferenceData) => void;
}

const AddPreferenceForm: React.FC<AddPreferenceFormProps> = ({ onClose, onSaveSuccess }) => {
  const [jobCategories, setJobCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [salaryExpectation, setSalaryExpectation] = useState<number | null>(null);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);

  const [masterCategories, setMasterCategories] = useState<{ value: string; label: string; }[]>([]);
  const [masterLocations, setMasterLocations] = useState<{ value: string; label: string; }[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);

  // Custom styles for react-select to match the modern design
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '8px',
      border: state.isFocused ? '2px solid #3b82f6' : '1px solid #e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      padding: '2px',
      background: 'rgba(249, 250, 251, 0.8)',
      backdropFilter: 'blur(8px)',
      fontSize: '0.875rem',
      minHeight: '36px',
      '&:hover': {
        borderColor: '#3b82f6',
        background: 'rgba(255, 255, 255, 0.9)',
      },
      transition: 'all 0.3s ease',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '6px',
      margin: '1px 2px',
      fontSize: '0.875rem',
      background: state.isSelected 
        ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
        : state.isFocused 
        ? 'rgba(59, 130, 246, 0.1)' 
        : 'transparent',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        background: state.isSelected 
          ? 'linear-gradient(135deg, #2563eb, #7c3aed)' 
          : 'rgba(59, 130, 246, 0.15)',
      },
      transition: 'all 0.2s ease',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      background: 'linear-gradient(135deg, #ddd6fe, #e0e7ff)',
      borderRadius: '16px',
      border: '1px solid #c4b5fd',
      fontSize: '0.75rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#6366f1',
      fontWeight: '500',
      fontSize: '0.75rem',
      padding: '2px 6px',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#6366f1',
      borderRadius: '0 16px 16px 0',
      '&:hover': {
        background: '#c4b5fd',
        color: '#4c1d95',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      fontSize: '0.875rem',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
      fontStyle: 'italic',
      fontSize: '0.875rem',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '2px 6px',
    }),
  };

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
      const payload: Omit<PreferenceData, 'id' | 'createdAt' | 'updatedAt'> = {
        jobCategories,
        locations,
        salaryExpectation,
        jobTypes,
      };
      const newPreferences = await setPreferences(payload);
      Swal.fire('Sukses!', 'Preferensi pekerjaan berhasil disimpan.', 'success');
      onSaveSuccess(newPreferences);
      onClose();
    } catch (err: any) {
      console.error("Failed to save preferences:", err);
      Swal.fire('Error', err.message || 'Gagal menyimpan preferensi pekerjaan.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const jobTypeOptions = validJobTypes.map(type => ({ value: type, label: type }));

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-purple-900/30 to-pink-900/30 backdrop-blur-md flex justify-center items-center z-[100] p-4">
      {/* Floating background elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="relative bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Enhanced header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-4">
          {/* Header decorative elements */}
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full blur-sm"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 bg-white/10 rounded-full blur-sm"></div>
          
          <div className="relative flex justify-between items-center text-white">
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl mr-3">
                <Target size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">Tambah Preferensi</h2>
                <p className="text-white/80 text-xs">Atur kriteria pekerjaan Anda</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="group bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all duration-300 hover:scale-110"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Job Categories */}
          <div className="group relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-t-xl"></div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-blue-300 transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg mr-3">
                  <Briefcase size={16} className="text-white" />
                </div>
                <label className="text-sm font-semibold text-gray-800">Kategori Pekerjaan</label>
              </div>
              <div className="ml-11">
                <CreatableSelect
                  isMulti
                  options={masterCategories}
                  onChange={(selected) => setJobCategories(selected.map(s => s.value))}
                  placeholder="Pilih atau ketik kategori..."
                  formatCreateLabel={(inputValue) => `Tambah "${inputValue}"`}
                  isDisabled={isSaving}
                  styles={customSelectStyles}
                />
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="group relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-xl"></div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-green-300 transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg mr-3">
                  <MapPin size={16} className="text-white" />
                </div>
                <label className="text-sm font-semibold text-gray-800">Lokasi Kerja</label>
              </div>
              <div className="ml-11">
                <CreatableSelect
                  isMulti
                  options={masterLocations}
                  onChange={(selected) => setLocations(selected.map(s => s.value))}
                  placeholder="Pilih atau ketik lokasi..."
                  formatCreateLabel={(inputValue) => `Tambah "${inputValue}"`}
                  isDisabled={isSaving}
                  styles={customSelectStyles}
                />
              </div>
            </div>
          </div>

          {/* Job Types */}
          <div className="group relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-t-xl"></div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-purple-300 transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg mr-3">
                  <CheckCircle size={16} className="text-white" />
                </div>
                <label className="text-sm font-semibold text-gray-800">Jenis Pekerjaan</label>
              </div>
              <div className="ml-11">
                <Select
                  isMulti
                  options={jobTypeOptions}
                  onChange={(selected) => setJobTypes(selected.map(s => s.value as JobType))}
                  placeholder="Pilih jenis pekerjaan..."
                  closeMenuOnSelect={false}
                  isDisabled={isSaving}
                  styles={customSelectStyles}
                />
              </div>
            </div>
          </div>

          {/* Salary Expectation */}
          <div className="group relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-t-xl"></div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-yellow-300 transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 shadow-lg mr-3">
                  <DollarSign size={16} className="text-white" />
                </div>
                <label className="text-sm font-semibold text-gray-800">Ekspektasi Gaji</label>
              </div>
              <div className="ml-11">
                <CurrencyInput
                  id="salaryExpectation"
                  name="salaryExpectation"
                  placeholder="Contoh: 10.000.000"
                  onValueChange={(value) => setSalaryExpectation(value ? parseInt(value) : null)}
                  prefix="Rp "
                  groupSeparator="."
                  decimalSeparator=","
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white/80 backdrop-blur-sm border border-white/30 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-white/90"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        </form>
        
        {/* Enhanced footer */}
        <div className="relative bg-gradient-to-r from-gray-50 to-white p-4 border-t border-gray-200/50">
          {/* Footer decorative elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500">
              <Sparkles size={14} className="text-purple-400 mr-2" />
              <span className="text-xs">Isi semua data dengan benar</span>
            </div>
            
            <div className="flex space-x-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-300 hover:shadow-md" 
                disabled={isSaving}
              >
                Batal
              </button>
              <button 
                type="submit" 
                onClick={() => document.querySelector<HTMLFormElement>('form')?.requestSubmit()} 
                className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center disabled:opacity-60 text-xs" 
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
                    <Save size={14} className="mr-1.5 group-hover:rotate-12 transition-transform" />
                    Simpan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPreferenceForm;