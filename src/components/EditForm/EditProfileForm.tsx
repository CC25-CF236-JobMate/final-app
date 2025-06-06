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
          <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-700 font-medium">Memuat data form...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="relative overflow-hidden w-full max-w-2xl max-h-[95vh]">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/5 rounded-full blur-2xl"></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-white/20 flex flex-col max-h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Edit Informasi Profil
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="group p-2 text-gray-400 hover:text-white bg-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/30 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2 flex-grow custom-scrollbar">
            {/* Photo Upload Section */}
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center justify-center">
                <Camera size={16} className="mr-2 text-blue-600" />
                Foto Profil
              </label>
              <div className="flex flex-col items-center">
                <div className="relative group mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-20 h-20 text-gray-400" />
                    )}
                    <label 
                      htmlFor="photoUrlModal" 
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer rounded-full"
                    >
                      <Camera size={24} />
                    </label>
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-blue-200/50 group-hover:border-blue-300/70 transition-colors duration-300 pointer-events-none"></div>
                  {/* Status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Star size={12} className="text-white fill-current" />
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
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById('photoUrlModal')?.click()}
                    className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg hover:shadow-xl hover:scale-105"
                    disabled={isSaving}
                  >
                    <Camera size={14} className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Ganti Foto
                  </button>
                  {(initialData.photoUrl || imagePreview) && (
                    <button
                      type="button"
                      onClick={handleDeletePhotoAndSubmit}
                      className="group inline-flex items-center bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/30 shadow-lg hover:shadow-xl hover:scale-105"
                      disabled={isSaving}
                    >
                      <Trash2 size={14} className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {inputFields.map(field => (
                <div key={field.name} className={field.type === 'textarea' || field.type === 'select' ? 'sm:col-span-2' : ''}>
                  <label htmlFor={`${field.name}Modal`} className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mr-2">
                      <field.icon size={12} className="text-blue-600" />
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
                      className="w-full px-4 py-3 text-sm rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md hover:from-blue-50/50 hover:to-purple-50/30"
                      disabled={isSaving}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={`${field.name}Modal`}
                      name={field.name}
                      value={profile[field.name as keyof ProfileData] as string || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md hover:from-blue-50/50 hover:to-purple-50/30 appearance-none"
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
                      className="w-full px-4 py-3 text-sm rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md hover:from-blue-50/50 hover:to-purple-50/30"
                      disabled={isSaving}
                    />
                  )}
                </div>
              ))}
            </div>
          
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
                    <X size={16} className="text-white" />
                  </div>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}
          </form>
          
          {/* Footer */}
          <div className="pt-6 border-t border-gray-200/50 mt-auto flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="group inline-flex items-center bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/30 shadow-lg hover:shadow-xl hover:scale-105"
              disabled={isSaving}
            >
              <X size={16} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Batal
            </button>
            <button
              type="submit"
              onClick={() => document.querySelector<HTMLFormElement>('form[class*="space-y-6"]')?.requestSubmit()}
              className="group inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/30 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>

          {/* Decorative footer */}
          <div className="mt-6 pt-4 border-t border-gray-200/50">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <Sparkles size={12} className="text-purple-400" />
                <span className="font-medium">Profil lengkap meningkatkan peluang karir Anda</span>
                <Sparkles size={12} className="text-indigo-400" />
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom scrollbar styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
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
        `}</style>
      </div>
    </div>
  );
};

export default EditProfileForm;