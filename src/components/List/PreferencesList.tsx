// src/components/list/PreferenceList.tsx
import React from 'react';
import { type PreferenceData } from '../../services/PreferenceService';
import { Target, Edit3, Briefcase, MapPin, DollarSign, CheckCircle } from 'lucide-react';

interface PreferenceListProps {
  preferences: PreferenceData | null;
  isLoading: boolean;
  error?: string | null;
  onEditClick: () => void;
  onAddClick: () => void;
}

const PreferenceItem: React.FC<{ icon: React.ElementType; label: string; children: React.ReactNode; }> = ({ icon: Icon, label, children }) => {
  return (
    <div className="py-4">
        <div className="flex items-center text-sm font-semibold text-gray-600 mb-2">
            <Icon size={16} className="mr-2 text-cyan-600"/>
            <span>{label}</span>
        </div>
        <div className="pl-6">{children}</div>
    </div>
  );
};

const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
        return <span className="italic text-gray-400">Belum diisi</span> as unknown as string;
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};


const PreferenceList: React.FC<PreferenceListProps> = ({ preferences, isLoading, error, onEditClick, onAddClick }) => {
  if (isLoading) {
    return (
      <div className="p-6 md:p-8 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="py-4 border-b border-gray-200 last:border-b-0">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2.5"></div>
            <div className="pl-6 space-y-1.5">
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                 <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !preferences) {
    // This case happens if preferences are not found (404) or another error occurred.
    // The "Add" button is more appropriate here.
    return (
        <div className="mt-6 text-center py-12 px-4 bg-white border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center min-h-[200px]">
          <button
            onClick={onAddClick}
            className="flex flex-col items-center text-cyan-600 hover:text-cyan-700 transition-colors group"
            aria-label="Tambah Preferensi Baru"
          >
            <Target size={48} className="mb-3 text-cyan-500 group-hover:text-cyan-600 transition-colors" strokeWidth={1.5}/>
            <span className="font-semibold text-lg">Tambah Preferensi</span>
            <span className="text-sm text-gray-500 group-hover:text-gray-600">Atur preferensi pekerjaan impian Anda.</span>
          </button>
          {error && <p className="text-xs text-red-500 mt-3">({error})</p>}
        </div>
    );
  }
  
  // This case for when data is successfully fetched but empty/null
  if (!preferences) {
      return (
         <div className="mt-6 text-center py-12 px-4 bg-white border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center min-h-[200px]">
          <button
            onClick={onAddClick}
            className="flex flex-col items-center text-cyan-600 hover:text-cyan-700 transition-colors group"
            aria-label="Tambah Preferensi Baru"
          >
            <Target size={48} className="mb-3 text-cyan-500 group-hover:text-cyan-600 transition-colors" strokeWidth={1.5}/>
            <span className="font-semibold text-lg">Tambah Preferensi</span>
            <span className="text-sm text-gray-500 group-hover:text-gray-600">Atur preferensi pekerjaan impian Anda.</span>
          </button>
        </div>
      );
  }


  return (
    <div className="mt-6 relative">
      <button 
        onClick={onEditClick}
        className="absolute top-0 right-0 mt-0 mr-0 p-2.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors z-10"
        aria-label="Edit Preferensi"
      >
        <Edit3 size={20} />
      </button>

      <div className="divide-y divide-gray-200">
        <PreferenceItem icon={Briefcase} label="Kategori Pekerjaan">
            <div className="flex flex-wrap gap-2">
                {preferences.jobCategories.length > 0 ? preferences.jobCategories.map(cat => <span key={cat} className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">{cat}</span>) : <span className="text-sm italic text-gray-400">Belum diisi</span>}
            </div>
        </PreferenceItem>
         <PreferenceItem icon={MapPin} label="Lokasi">
             <div className="flex flex-wrap gap-2">
                {preferences.locations.length > 0 ? preferences.locations.map(loc => <span key={loc} className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">{loc}</span>) : <span className="text-sm italic text-gray-400">Belum diisi</span>}
            </div>
        </PreferenceItem>
        <PreferenceItem icon={CheckCircle} label="Jenis Pekerjaan">
             <div className="flex flex-wrap gap-2">
                {preferences.jobTypes.length > 0 ? preferences.jobTypes.map(type => <span key={type} className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">{type}</span>) : <span className="text-sm italic text-gray-400">Belum diisi</span>}
            </div>
        </PreferenceItem>
        <PreferenceItem icon={DollarSign} label="Ekspektasi Gaji (Per Bulan)">
            <p className="text-sm text-gray-800">{formatCurrency(preferences.salaryExpectation)}</p>
        </PreferenceItem>
      </div>
    </div>
  );
};

export default PreferenceList;
