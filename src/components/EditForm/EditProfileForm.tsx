// src/components/EditForm/EditProfileForm.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { updateProfile, deleteProfilePhoto } from '../../services/ProfileService';
import Swal from 'sweetalert2';
import { Camera, Trash2, Save, UserCircle, Phone, MapPin, Linkedin, Github, Instagram, Link as LinkIcon, Info, X, Sparkles, Star } from 'lucide-react';

interface ProfileData {
  fullName?: string;
  phoneNumber?: string;
  city?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  portfolioSite?: string;
  username?: string;
  status?: string;
  photoUrl?: string | null;
}

interface EditProfileFormProps {
  initialData: ProfileData | null;
  onClose: () => void;
  onSaveSuccess: (updatedData: ProfileData) => void;
}

const statusOptions = [
  "Aktif Mencari Pekerjaan",
  "Selalu Terbuka untuk Oportunitas",
  "Tidak Terbuka"
];

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, onClose, onSaveSuccess }) => {
  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    phoneNumber: '',
    city: '',
    linkedin: '',
    github: '',
    instagram: '',
    portfolioSite: '',
    username: '',
    status: statusOptions[0],
    photoUrl: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setProfile(prev => ({
        ...prev,
        ...initialData,
        status: initialData.status || statusOptions[0]
      }));
      if (initialData.photoUrl) {
        setImagePreview(initialData.photoUrl);
      } else {
        setImagePreview(null);
      }
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'Ukuran gambar maksimal 5MB.', 'error');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const dataToUpdate: Partial<ProfileData> = {};
    let hasChanges = false;

    (Object.keys(profile) as Array<keyof ProfileData>).forEach(key => {
        const initialValue = initialData ? initialData[key] : undefined;
        if (profile[key] !== initialValue && key !== 'photoUrl') {
            dataToUpdate[key] = profile[key];
            hasChanges = true;
        }
    });
    
    if (selectedFile && imagePreview) {
        dataToUpdate.photoUrl = imagePreview; 
        hasChanges = true;
    }

    if (!hasChanges) {
      Swal.fire('Info', 'Tidak ada perubahan untuk disimpan.', 'info');
      setIsSaving(false);
      onClose();
      return;
    }

    try {
      const result = await updateProfile(dataToUpdate);
      Swal.fire('Sukses!', 'Profil berhasil diperbarui.', 'success');
      
      const finalUpdatedData = { ...initialData, ...profile, ...dataToUpdate };
      if (result.photoUrl !== undefined) { 
        finalUpdatedData.photoUrl = result.photoUrl;
      }
      onSaveSuccess(finalUpdatedData);
      onClose();
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || 'Gagal memperbarui profil.');
      Swal.fire('Error', err.message || 'Gagal memperbarui profil.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePhotoAndSubmit = async () => {
    if (!initialData?.photoUrl && !imagePreview) {
        Swal.fire('Info', 'Tidak ada foto profil untuk dihapus.', 'info');
        return;
    }

    Swal.fire({
      title: 'Anda yakin?',
      text: "Foto profil akan dihapus dari server!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSaving(true);
        try {
          await deleteProfilePhoto();
          const updatedProfileData = { ...profile, photoUrl: null };
          setProfile(updatedProfileData);
          setImagePreview(null);
          setSelectedFile(null);
          Swal.fire('Dihapus!', 'Foto profil telah dihapus dari server.', 'success');
          onSaveSuccess(updatedProfileData); 
        } catch (err: any) {
          console.error("Failed to delete photo from server:", err);
          Swal.fire('Error', err.message || 'Gagal menghapus foto profil dari server.', 'error');
        } finally {
          setIsSaving(false);
        }
      }
    });
  };
  
  const inputFields = [
    { name: 'fullName', label: 'Nama Lengkap', placeholder: 'Masukkan nama lengkap Anda', icon: UserCircle },
    { name: 'username', label: 'Username', placeholder: 'Masukkan username Anda', icon: UserCircle },
    { name: 'phoneNumber', label: 'Nomor Telepon', placeholder: 'Contoh: 081234567890', icon: Phone },
    { name: 'city', label: 'Kota', placeholder: 'Contoh: Jakarta', icon: MapPin },
    { 
      name: 'status', 
      label: 'Status Saat Ini', 
      icon: Info, 
      type: 'select',
      options: statusOptions
    },
    { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username', icon: Linkedin },
    { name: 'github', label: 'GitHub URL', placeholder: 'https://github.com/username', icon: Github },
    { name: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/username', icon: Instagram },
    { name: 'portfolioSite', label: 'Website Portfolio', placeholder: 'https://myportfolio.com', icon: LinkIcon },
  ];

  if (!initialData) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl text-center border border-white/20">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin w-6 h-6 md:w-8 md:h-8 border-2 border-white border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-700 font-medium text-sm md:text-base">Memuat data form...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-2 sm:p-4">
      <div className="relative overflow-hidden w-full h-full sm:h-auto sm:max-h-[95vh] max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"></div>
        <div className="absolute top-5 right-5 md:top-10 md:right-10 w-16 h-16 md:w-32 md:h-32 bg-blue-400/5 rounded-full blur-xl md:blur-2xl"></div>
        <div className="absolute bottom-5 left-5 md:bottom-10 md:left-10 w-20 h-20 md:w-40 md:h-40 bg-purple-400/5 rounded-full blur-xl md:blur-2xl"></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm h-full sm:h-auto sm:max-h-[95vh] rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-white/20 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 sm:p-6 md:p-8 pb-3 sm:pb-4 border-b border-gray-200/50 flex-shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles size={16} className="sm:hidden text-white" />
                <Sparkles size={20} className="hidden sm:block text-white" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Edit Profil
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="group p-1.5 sm:p-2 text-gray-400 hover:text-white bg-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/30 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <X size={18} className="sm:hidden group-hover:rotate-90 transition-transform duration-300" />
              <X size={20} className="hidden sm:block group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 pt-4">
              {/* Photo Upload Section */}
              <div className="text-center">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center justify-center">
                  <Camera size={14} className="sm:hidden mr-2 text-blue-600" />
                  <Camera size={16} className="hidden sm:block mr-2 text-blue-600" />
                  Foto Profil
                </label>
                <div className="flex flex-col items-center">
                  <div className="relative group mb-3 sm:mb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-2 sm:border-4 border-white shadow-xl relative">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-400" />
                      )}
                      <label 
                        htmlFor="photoUrlModal" 
                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer rounded-full"
                      >
                        <Camera size={18} className="sm:hidden" />
                        <Camera size={24} className="hidden sm:block" />
                      </label>
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-blue-200/50 group-hover:border-blue-300/70 transition-colors duration-300 pointer-events-none"></div>
                    {/* Status indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Star size={10} className="sm:hidden text-white fill-current" />
                      <Star size={12} className="hidden sm:block text-white fill-current" />
                    </div>
                  </div>
                  <input
                    id="photoUrlModal"
                    name="photoUrl"
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      type="button"
                      onClick={() => document.getElementById('photoUrlModal')?.click()}
                      className="group inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-3 sm:px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg hover:shadow-xl hover:scale-105 text-sm"
                      disabled={isSaving}
                    >
                      <Camera size={12} className="sm:hidden mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      <Camera size={14} className="hidden sm:block mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Ganti Foto
                    </button>
                    {(initialData.photoUrl || imagePreview) && (
                      <button
                        type="button"
                        onClick={handleDeletePhotoAndSubmit}
                        className="group inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-2 px-3 sm:px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/30 shadow-lg hover:shadow-xl hover:scale-105 text-sm"
                        disabled={isSaving}
                      >
                        <Trash2 size={12} className="sm:hidden mr-2 group-hover:rotate-12 transition-transform duration-300" />
                        <Trash2 size={14} className="hidden sm:block mr-2 group-hover:rotate-12 transition-transform duration-300" />
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {inputFields.map(field => (
                  <div key={field.name} className={field.type === 'textarea' || field.type === 'select' ? 'md:col-span-2' : ''}>
                    <label htmlFor={`${field.name}Modal`} className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mr-2">
                        <field.icon size={10} className="sm:hidden text-blue-600" />
                        <field.icon size={12} className="hidden sm:block text-blue-600" />
                      </div>
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={`${field.name}Modal`}
                        name={field.name}
                        rows={3}
                        value={profile[field.name as keyof ProfileData] as string || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md hover:from-blue-50/50 hover:to-purple-50/30"
                        disabled={isSaving}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        id={`${field.name}Modal`}
                        name={field.name}
                        value={profile[field.name as keyof ProfileData] as string || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md hover:from-blue-50/50 hover:to-purple-50/30 appearance-none"
                        disabled={isSaving}
                      >
                        {field.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        id={`${field.name}Modal`}
                        name={field.name}
                        value={profile[field.name as keyof ProfileData] as string || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md hover:from-blue-50/50 hover:to-purple-50/30"
                        disabled={isSaving}
                      />
                    )}
                  </div>
                ))}
              </div>
            
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
                      <X size={12} className="sm:hidden text-white" />
                      <X size={16} className="hidden sm:block text-white" />
                    </div>
                    <p className="text-xs sm:text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          {/* Footer */}
          <div className="p-4 sm:p-6 md:p-8 pt-4 sm:pt-6 border-t border-gray-200/50 flex-shrink-0 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="group inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl border border-gray-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/30 shadow-lg hover:shadow-xl hover:scale-105 text-sm"
              disabled={isSaving}
            >
              <X size={14} className="sm:hidden mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <X size={16} className="hidden sm:block mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Batal
            </button>
            <button
              type="submit"
              onClick={() => document.querySelector<HTMLFormElement>('form[class*="space-y"]')?.requestSubmit()}
              className="group inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/30 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={14} className="sm:hidden mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  <Save size={16} className="hidden sm:block mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Simpan
                </>
              )}
            </button>
          </div>

          {/* Decorative footer */}
          <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 border-t border-gray-200/50">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 sm:w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <Sparkles size={10} className="sm:hidden text-purple-400" />
                <Sparkles size={12} className="hidden sm:block text-purple-400" />
                <span className="font-medium text-xs sm:text-sm">Profil lengkap meningkatkan peluang karir</span>
                <Sparkles size={10} className="sm:hidden text-indigo-400" />
                <Sparkles size={12} className="hidden sm:block text-indigo-400" />
                <div className="w-4 sm:w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom scrollbar styles */}
        <style>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #94a3b8, #64748b);
          }
          
          @media (max-width: 640px) {
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default EditProfileForm;