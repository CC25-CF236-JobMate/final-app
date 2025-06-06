// src/components/list/ProfileList.tsx
import React from 'react';
import { Phone, MapPin, Linkedin, Github, Instagram, Link as LinkIcon, Briefcase, Info, Edit3, Mail, User, Sparkles, Star } from 'lucide-react';

interface ProfileData {
  fullName?: string;
  username?: string;
  phoneNumber?: string;
  city?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  portfolioSite?: string;
  status?: string;
  photoUrl?: string | null;
  email?: string; 
}

interface ProfileListProps {
  profile: ProfileData | null;
  isLoading?: boolean;
  error?: string | null;
  onEditClick: () => void; 
}

const ProfileListItem: React.FC<{ icon: React.ElementType; label: string; value?: string | null; isLink?: boolean; placeholder?: string }> = ({ icon: Icon, label, value, isLink, placeholder = "Belum diisi" }) => {
  const displayValue = value && value.trim() !== '' ? value : <span className="italic text-gray-400">{placeholder}</span>;
  
  return (
    <div className="group flex items-start py-5 px-1 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 hover:backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mr-4 flex-shrink-0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
      </div>
      <div className="flex-grow">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{label}</p>
        {isLink && value && value.trim() !== '' ? (
          <a 
            href={value.startsWith('http') ? value : `https://${value}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-800 hover:text-blue-700 hover:underline break-all font-medium text-sm leading-relaxed transition-colors duration-200 inline-flex items-center group"
          >
            {value}
            <LinkIcon size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </a>
        ) : (
          <div className="text-gray-800 break-words font-medium text-sm leading-relaxed">{displayValue}</div>
        )}
      </div>
    </div>
  );
};

const ProfileList: React.FC<ProfileListProps> = ({ profile, isLoading, error, onEditClick }) => {
  if (isLoading) {
    return (
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm p-6 md:p-8 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-6 border-b border-gray-200/50">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0"></div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-200 rounded-full"></div>
            </div>
            <div className="w-full mt-4 sm:mt-0 text-center sm:text-left">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-3/4 sm:w-1/2 mb-3 mx-auto sm:mx-0"></div>
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 sm:w-1/3 mb-4 mx-auto sm:mx-0"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full sm:w-3/4 mx-auto sm:mx-0"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center py-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl mr-4 flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50"></div>
        <div className="relative text-center bg-white/90 backdrop-blur-sm p-6 md:p-8 border border-red-100">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Profil</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Silakan coba muat ulang halaman atau hubungi administrator.</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50/30"></div>
        <div className="relative text-center bg-white/90 backdrop-blur-sm p-8 md:p-12">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Profil Belum Lengkap</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            Lengkapi profil Anda untuk meningkatkan peluang karir dan membuat kesan profesional yang baik.
          </p>
          <button 
            onClick={onEditClick}
            className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Edit3 size={18} className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Lengkapi Profil Sekarang
          </button>
        </div>
      </div>
    );
  }

  const profileItems = [
    { icon: Mail, label: "Email", value: profile.email, placeholder: "Email tidak tersedia" },
    { icon: Phone, label: "Nomor Telepon", value: profile.phoneNumber },
    { icon: MapPin, label: "Kota", value: profile.city },
    { icon: Briefcase, label: "Status Saat Ini", value: profile.status },
    { icon: Linkedin, label: "LinkedIn", value: profile.linkedin, isLink: true },
    { icon: Github, label: "GitHub", value: profile.github, isLink: true },
    { icon: Instagram, label: "Instagram", value: profile.instagram, isLink: true },
    { icon: LinkIcon, label: "Website Portfolio", value: profile.portfolioSite, isLink: true },
  ];

  const hasProfileDetails = profileItems.some(item => item.value && item.value.trim() !== '');

  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/5 rounded-full blur-2xl"></div>
      
      <div className="relative bg-white/90 backdrop-blur-sm p-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-6 border-b border-gray-200/50 relative">
          <div className="relative group">
            <img
              src={profile.photoUrl || 'https://placehold.co/128x128/E2E8F0/A0AEC0?text=Foto&font=roboto'}
              alt={profile.fullName || 'User Avatar'}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src='https://placehold.co/128x128/E2E8F0/A0AEC0?text=Foto&font=roboto';
              }}
            />
            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-200/50 group-hover:border-blue-300/70 transition-colors duration-300 pointer-events-none"></div>
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <Star size={12} className="text-white fill-current" />
            </div>
          </div>
          
          <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
              {profile.fullName || <span className="italic text-gray-400">Nama Belum Diisi</span>}
            </h1>
            <p className="text-lg text-blue-600 font-medium mb-3">
              {profile.username || <span className="italic text-gray-400">Username Belum Diisi</span>}
            </p>
            {/* Profile completion indicator */}
            <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500">
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                <Sparkles size={14} className="text-blue-500 mr-1" />
                <span className="font-medium">Profil {hasProfileDetails ? 'Aktif' : 'Perlu Dilengkapi'}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onEditClick} 
            className="group absolute top-2 right-2 sm:static p-3 text-blue-600 hover:text-white bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg hover:shadow-xl hover:scale-110"
            aria-label="Edit Profil"
          >
            <Edit3 size={20} className="group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Profile Details */}
        <div className="space-y-2">
          {profileItems.map((item, index) => (
            <ProfileListItem 
              key={index} 
              icon={item.icon} 
              label={item.label} 
              value={item.value} 
              isLink={item.isLink} 
              placeholder={item.placeholder}
            />
          ))}
          
          {!hasProfileDetails && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 text-gray-500 bg-gray-50/80 backdrop-blur-sm px-6 py-4 rounded-2xl">
                <Info size={18} className="text-blue-400" />
                <span className="font-medium">Detail profil Anda masih kosong. Klik tombol edit untuk melengkapinya.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer decoration */}
        {hasProfileDetails && (
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <Sparkles size={14} className="text-purple-400" />
                <span className="font-medium">Profil lengkap meningkatkan visibilitas Anda</span>
                <Sparkles size={14} className="text-indigo-400" />
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileList;