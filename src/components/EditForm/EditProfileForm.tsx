// src/components/EditForm/EditProfileForm.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { updateProfile, deleteProfilePhoto } from '../../services/ProfileService';
import Swal from 'sweetalert2';
import { Camera, Trash2, Save, UserCircle, Phone, MapPin, Linkedin, Github, Instagram, Link as LinkIcon, Info, X } from 'lucide-react';

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
    status: statusOptions[0], // Default ke opsi pertama
    photoUrl: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setProfile(prev => ({
        ...prev, // Pertahankan default status jika initialData.status null/undefined
        ...initialData,
        status: initialData.status || statusOptions[0] // Pastikan status memiliki nilai default yang valid
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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
        // Cek jika field ada di initialData atau jika field baru ditambahkan dan memiliki nilai
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
      onClose(); // Tutup modal jika tidak ada perubahan
      return;
    }

    try {
      const result = await updateProfile(dataToUpdate);
      Swal.fire('Sukses!', 'Profil berhasil diperbarui.', 'success');
      
      const finalUpdatedData = { ...initialData, ...profile, ...dataToUpdate }; // Gabungkan initial, profile state, dan data yg diupdate
      if (result.photoUrl !== undefined) { 
        finalUpdatedData.photoUrl = result.photoUrl;
      } else if (dataToUpdate.photoUrl && !result.photoUrl && selectedFile) {
        // Jika kita kirim base64 (selectedFile ada) tapi backend tidak return URL baru (misalnya error parsial)
        // Sebaiknya, kita pertahankan imagePreview sebagai photoUrl sementara di UI,
        // atau idealnya backend selalu konsisten.
        // Untuk sekarang, kita asumsikan jika upload berhasil, URL dari server akan ada di result.
        // Jika tidak, photoUrl di `finalUpdatedData` akan dari `dataToUpdate.photoUrl` (base64)
        // yang mungkin tidak ideal untuk display jangka panjang.
        // Solusi lebih baik: setelah update, panggil fetchProfile lagi di parent.
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
      type: 'select', // Ubah tipe menjadi select
      options: statusOptions // Tambahkan opsi dropdown
    },
    { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username', icon: Linkedin },
    { name: 'github', label: 'GitHub URL', placeholder: 'https://github.com/username', icon: Github },
    { name: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/username', icon: Instagram },
    { name: 'portfolioSite', label: 'Website Portfolio', placeholder: 'https://myportfolio.com', icon: LinkIcon },
  ];

  if (!initialData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memuat data form...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[100] p-4 ">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Edit Informasi Profil</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-2 flex-grow custom-scrollbar">
          {/* Photo Upload Section */}
          <div className="mb-6 text-center">
              <label htmlFor="photoUrlModal" className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
              <div className="mt-1 flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300 mb-3 relative group">
                      {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                          <UserCircle className="w-20 h-20 text-gray-400" />
                      )}
                      <label 
                          htmlFor="photoUrlModal" 
                          className="absolute inset-0 flex items-center justify-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                      >
                          <Camera size={28} />
                      </label>
                  </div>
                  <input
                      id="photoUrlModal"
                      name="photoUrl"
                      type="file"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                  />
                  <div className="flex space-x-2">
                      <button
                          type="button"
                          onClick={() => document.getElementById('photoUrlModal')?.click()}
                          className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                          disabled={isSaving}
                      >
                          <Camera size={14} className="mr-1"/> Ganti
                      </button>
                      {(initialData.photoUrl || imagePreview) && (
                          <button
                              type="button"
                              onClick={handleDeletePhotoAndSubmit}
                              className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
                              disabled={isSaving}
                          >
                             <Trash2 size={14} className="mr-1"/> Hapus
                          </button>
                      )}
                  </div>
              </div>
          </div>

          {/* Textual Fields Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
            {inputFields.map(field => (
              <div key={field.name} className={field.type === 'textarea' || field.type === 'select' ? 'sm:col-span-2' : ''}>
                <label htmlFor={`${field.name}Modal`} className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                  <field.icon size={14} className="mr-1.5 text-blue-600" />
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
                    className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
                    disabled={isSaving}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={`${field.name}Modal`}
                    name={field.name}
                    value={profile[field.name as keyof ProfileData] as string || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm appearance-none"
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
                    className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
                    disabled={isSaving}
                  />
                )}
              </div>
            ))}
          </div>
        
          {error && <p className="text-xs text-red-600 bg-red-100 p-2 rounded-md text-center my-2">{error}</p>}
        </form>
        
        <div className="pt-5 border-t mt-auto flex justify-end space-x-3"> {/* mt-auto untuk mendorong ke bawah */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit" // Mengacu pada form, jadi harus di dalam <form> atau panggil handleSubmit dari sini
              onClick={() => document.querySelector<HTMLFormElement>('form[class*="space-y-5"]')?.requestSubmit()} // Cara alternatif trigger submit
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
       {/* CSS untuk custom scrollbar jika diperlukan */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7c7c7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a3a3a3;
        }
      `}</style>
    </div>
  );
};

export default EditProfileForm;
