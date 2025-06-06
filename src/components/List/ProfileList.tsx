// src/components/list/ProfileList.tsx
import React from 'react';
import {  Phone, MapPin, Linkedin, Github, Instagram, Link as LinkIcon, Briefcase, Info, Edit3, Mail } from 'lucide-react';

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
    <div className="flex items-start py-4">
      <Icon className="w-5 h-5 text-blue-600 mr-4 mt-1 flex-shrink-0" />
      <div className="flex-grow">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
        {isLink && value && value.trim() !== '' ? (
          <a 
            href={value.startsWith('http') ? value : `https://${value}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-800 hover:text-blue-700 hover:underline break-all text-sm leading-relaxed"
          >
            {value}
          </a>
        ) : (
          <div className="text-gray-800 break-words text-sm leading-relaxed">{displayValue}</div>
        )}
      </div>
    </div>
  );
};


const ProfileList: React.FC<ProfileListProps> = ({ profile, isLoading, error, onEditClick }) => {
  if (isLoading) {
    return (
        <div className="bg-white p-6 md:p-8 shadow-xl rounded-xl animate-pulse">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-6 border-b border-gray-200">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="w-full mt-4 sm:mt-0">
                    <div className="h-7 bg-gray-300 rounded w-3/4 sm:w-1/2 mb-2"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/2 sm:w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-full sm:w-3/4"></div>
                </div>
            </div>
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="py-2">
                        <div className="h-3 bg-gray-300 rounded w-1/4 mb-1.5"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  if (error && !profile) { // Hanya tampilkan error besar jika tidak ada profil sama sekali
    return (
      <div className="text-center text-red-600 bg-red-50 p-6 md:p-8 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Gagal Memuat Profil</h3>
        <p className="text-sm">{error}</p>
        <p className="text-sm mt-2">Silakan coba muat ulang halaman.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-gray-500 bg-white p-6 md:p-8 rounded-lg shadow">
        <Info size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="font-semibold mb-2">Profil Belum Lengkap</h3>
        <p className="text-sm">Sepertinya data profil Anda belum ada atau belum dilengkapi.</p>
        <button 
          onClick={onEditClick}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md flex items-center mx-auto"
        >
          <Edit3 size={16} className="mr-2" />
          Lengkapi Profil Sekarang
        </button>
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

  // Cek apakah ada data selain foto, nama, dan username (data di profileItems)
  const hasProfileDetails = profileItems.some(item => item.value && item.value.trim() !== '');


  return (
    <div className="bg-white p-6 md:p-8"> {/* Hapus shadow dan rounded dari sini jika sudah ada di parent */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-6 border-b border-gray-200 relative">
        <img
          src={profile.photoUrl || 'https://placehold.co/128x128/E2E8F0/A0AEC0?text=Foto&font=roboto'}
          alt={profile.fullName || 'User Avatar'}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg flex-shrink-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src='https://placehold.co/128x128/E2E8F0/A0AEC0?text=Foto&font=roboto';
          }}
        />
        <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.fullName || <span className="italic text-gray-400">Nama Belum Diisi</span>}</h1>
          <p className="text-md text-blue-600">{profile.username || <span className="italic text-gray-400">Username Belum Diisi</span>}</p>
        </div>
        <button 
          onClick={onEditClick} 
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Edit Profil"
        >
          <Edit3 size={22} />
        </button>
      </div>
      
      <div className="divide-y divide-gray-200">
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
            <p className="text-center text-gray-500 py-6 text-sm">
                Detail profil Anda masih kosong. Klik tombol edit untuk melengkapinya.
            </p>
        )}
      </div>
    </div>
  );
};

export default ProfileList;
