// src/components/list/PreferenceList.tsx
import React from 'react';
import { type PreferenceData } from '../../services/PreferenceService';
import { Target, Edit3, Briefcase, MapPin, DollarSign, CheckCircle, Plus, Sparkles } from 'lucide-react';

interface PreferenceListProps {
  preferences: PreferenceData | null;
  isLoading: boolean;
  error?: string | null;
  onEditClick: () => void;
  onAddClick: () => void;
}

const PreferenceItem: React.FC<{ icon: React.ElementType; label: string; children: React.ReactNode; gradient: string; }> = ({ icon: Icon, label, children, gradient }) => {
  return (
    <div className="group relative overflow-hidden">
      <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-white/80">
        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`}></div>
        
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg mr-4`}>
            <Icon size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
        </div>
        
        <div className="ml-16">
          {children}
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (value: number | null | undefined): React.ReactNode => {
    if (value === null || value === undefined) {
        return <span className="italic text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full text-sm">Belum diisi</span>;
    }
    return (
        <span className="font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-full text-lg">
            {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value)}
        </span>
    );
};

const PreferenceList: React.FC<PreferenceListProps> = ({ preferences, isLoading, error, onEditClick, onAddClick }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-gray-300 rounded-xl mr-4"></div>
                <div className="h-6 bg-gray-300 rounded-lg w-1/3"></div>
              </div>
              <div className="ml-16 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !preferences) {
    return (
      <div className="relative">
        {/* Enhanced empty state with gradient background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-3xl border-2 border-dashed border-pink-200 hover:border-pink-300 transition-all duration-300">
          {/* Floating elements */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-pink-200/50 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-200/50 rounded-full blur-xl"></div>
          
          <div className="relative text-center py-16 px-8">
            <button
              onClick={onAddClick}
              className="group relative inline-flex flex-col items-center transition-all duration-300 hover:scale-105"
              aria-label="Tambah Preferensi Baru"
            >
              {/* Enhanced icon with gradient background */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-3xl shadow-xl">
                  <Target size={40} className="text-white" strokeWidth={1.5}/>
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg animate-bounce">
                  <Plus size={16} className="text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Tambah Preferensi
              </h3>
              <p className="text-gray-600 max-w-md leading-relaxed">
                Atur preferensi pekerjaan impian Anda untuk mendapatkan rekomendasi yang lebih tepat sasaran
              </p>
              
              {/* Decorative elements */}
              <div className="flex items-center gap-2 mt-4 text-purple-500">
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-sm font-medium">Mulai sekarang</span>
                <Sparkles size={16} className="animate-pulse delay-500" />
              </div>
            </button>
            
            {error && (
              <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">({error})</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (!preferences) {
    return (
      <div className="relative">
        {/* Enhanced empty state */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl border-2 border-dashed border-blue-200 hover:border-blue-300 transition-all duration-300">
          <div className="absolute top-4 right-4 w-12 h-12 bg-blue-200/50 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-200/50 rounded-full blur-xl"></div>
          
          <div className="relative text-center py-16 px-8">
            <button
              onClick={onAddClick}
              className="group relative inline-flex flex-col items-center transition-all duration-300 hover:scale-105"
              aria-label="Tambah Preferensi Baru"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-3xl shadow-xl">
                  <Target size={40} className="text-white" strokeWidth={1.5}/>
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-2 shadow-lg animate-bounce">
                  <Plus size={16} className="text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Tambah Preferensi
              </h3>
              <p className="text-gray-600 max-w-md leading-relaxed">
                Atur preferensi pekerjaan impian Anda untuk mendapatkan rekomendasi yang lebih tepat sasaran
              </p>
              
              <div className="flex items-center gap-2 mt-4 text-blue-500">
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-sm font-medium">Mulai sekarang</span>
                <Sparkles size={16} className="animate-pulse delay-500" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Enhanced header with edit button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-3 rounded-xl shadow-lg mr-4">
            <Target size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Preferensi Pekerjaan</h2>
            <p className="text-gray-600">Kriteria pekerjaan yang Anda inginkan</p>
          </div>
        </div>
        
        <button 
          onClick={onEditClick}
          className="group relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white lg:px-6 lg:py-3 px-3 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Edit Preferensi"
        >
          <div className="flex items-center">
            <Edit3 size={18} className="lg:mr-2 group-hover:rotate-12 transition-transform" />
            <span className="font-medium hidden lg:inline">Edit</span>
          </div>
        </button>
      </div>

      {/* Enhanced preference items */}
      <div className="space-y-6">
        <PreferenceItem 
          icon={Briefcase} 
          label="Kategori Pekerjaan"
          gradient="from-blue-500 to-cyan-600"
        >
          <div className="flex flex-wrap gap-2">
            {preferences.jobCategories.length > 0 ? 
              preferences.jobCategories.map(cat => (
                <span 
                  key={cat} 
                  className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:shadow-md transition-shadow"
                >
                  {cat}
                </span>
              )) : 
              <span className="italic text-gray-400 bg-gray-50 px-4 py-2 rounded-full text-sm">
                Belum diisi
              </span>
            }
          </div>
        </PreferenceItem>

        <PreferenceItem 
          icon={MapPin} 
          label="Lokasi Kerja"
          gradient="from-green-500 to-emerald-600"
        >
          <div className="flex flex-wrap gap-2">
            {preferences.locations.length > 0 ? 
              preferences.locations.map(loc => (
                <span 
                  key={loc} 
                  className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200 hover:shadow-md transition-shadow"
                >
                  {loc}
                </span>
              )) : 
              <span className="italic text-gray-400 bg-gray-50 px-4 py-2 rounded-full text-sm">
                Belum diisi
              </span>
            }
          </div>
        </PreferenceItem>

        <PreferenceItem 
          icon={CheckCircle} 
          label="Jenis Pekerjaan"
          gradient="from-purple-500 to-pink-600"
        >
          <div className="flex flex-wrap gap-2">
            {preferences.jobTypes.length > 0 ? 
              preferences.jobTypes.map(type => (
                <span 
                  key={type} 
                  className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium border border-purple-200 hover:shadow-md transition-shadow"
                >
                  {type}
                </span>
              )) : 
              <span className="italic text-gray-400 bg-gray-50 px-4 py-2 rounded-full text-sm">
                Belum diisi
              </span>
            }
          </div>
        </PreferenceItem>

        <PreferenceItem 
          icon={DollarSign} 
          label="Ekspektasi Gaji (Per Bulan)"
          gradient="from-yellow-500 to-orange-600"
        >
          <div className="flex items-center">
            {formatCurrency(preferences.salaryExpectation)}
          </div>
        </PreferenceItem>
      </div>

      {/* Enhanced bottom decoration */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 text-gray-500">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
          <Sparkles size={16} className="text-pink-400" />
          <span className="text-sm font-medium">Preferensi yang jelas membantu menemukan pekerjaan ideal</span>
          <Sparkles size={16} className="text-purple-400" />
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceList;