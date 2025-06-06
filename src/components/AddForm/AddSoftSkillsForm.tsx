// src/components/AddForm/AddSoftSkillsForm.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent, useRef } from 'react';
import { type Skill, addSoftSkills, fetchMasterSoftSkills, skillLevels } from '../../services/SkillsService';
import Swal from 'sweetalert2';
import { Save, X, PlusCircle, Brain, Sparkles, Star } from 'lucide-react';

interface AddSoftSkillsFormProps {
  onClose: () => void;
  onAddSuccess: () => void;
  existingSkillNames: string[];
}

interface MasterSkillOption {
  id: string;
  name: string;
}

const AddSoftSkillsForm: React.FC<AddSoftSkillsFormProps> = ({ onClose, onAddSuccess, existingSkillNames }) => {
  const [skillsToAdd, setSkillsToAdd] = useState<Array<Omit<Skill, 'id' | 'createdAt'>>>([{ name: '', level: skillLevels[0] }]);
  const [masterSkills, setMasterSkills] = useState<MasterSkillOption[]>([]);
  const [searchTerms, setSearchTerms] = useState<string[]>(['']);
  const [showDropdowns, setShowDropdowns] = useState<boolean[]>([false]);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isLoadingMasterSkills, setIsLoadingMasterSkills] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadMasterSkills = async () => {
      setIsLoadingMasterSkills(true);
      try {
        const fetchedMasterSkills = await fetchMasterSoftSkills();
        setMasterSkills(fetchedMasterSkills);
      } catch (error) {
        console.error("Failed to load master soft skills:", error);
      } finally {
        setIsLoadingMasterSkills(false);
      }
    };
    loadMasterSkills();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        dropdownRefs.current.forEach((ref, index) => {
            if (ref && !ref.contains(event.target as Node)) {
                setShowDropdowns(prev => {
                    const newShow = [...prev];
                    newShow[index] = false;
                    return newShow;
                });
            }
        });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSkillNameChange = (index: number, value: string) => {
    const updatedSkills = [...skillsToAdd];
    updatedSkills[index].name = value;
    setSkillsToAdd(updatedSkills);

    const updatedSearchTerms = [...searchTerms];
    updatedSearchTerms[index] = value;
    setSearchTerms(updatedSearchTerms);

    const updatedShowDropdowns = [...showDropdowns];
    updatedShowDropdowns[index] = true;
    setShowDropdowns(updatedShowDropdowns);
  };

  const handleSkillLevelChange = (index: number, value: Skill['level']) => {
    const updatedSkills = [...skillsToAdd];
    updatedSkills[index].level = value;
    setSkillsToAdd(updatedSkills);
  };

  const handleSelectMasterSkill = (index: number, skillName: string) => {
    const updatedSkills = [...skillsToAdd];
    updatedSkills[index].name = skillName;
    setSkillsToAdd(updatedSkills);

    const updatedSearchTerms = [...searchTerms];
    updatedSearchTerms[index] = skillName;
    setSearchTerms(updatedSearchTerms);

    const updatedShowDropdowns = [...showDropdowns];
    updatedShowDropdowns[index] = false;
    setShowDropdowns(updatedShowDropdowns);
  };

  const addSkillField = () => {
    setSkillsToAdd([...skillsToAdd, { name: '', level: skillLevels[0] }]);
    setSearchTerms([...searchTerms, '']);
    setShowDropdowns([...showDropdowns, false]);
    dropdownRefs.current.push(null);
  };

  const removeSkillField = (index: number) => {
    if (skillsToAdd.length <= 1) return;
    setSkillsToAdd(skillsToAdd.filter((_, i) => i !== index));
    setSearchTerms(searchTerms.filter((_, i) => i !== index));
    setShowDropdowns(showDropdowns.filter((_, i) => i !== index));
    dropdownRefs.current = dropdownRefs.current.filter((_,i) => i !== index);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const skillsToSubmit = skillsToAdd
        .map(skill => ({ ...skill, name: skill.name.trim() }))
        .filter(skill => skill.name !== '' && skill.level.trim() !== '');

    if (skillsToSubmit.length === 0) {
      Swal.fire('Input Kosong', 'Mohon isi setidaknya satu soft skill dengan nama dan level.', 'warning');
      return;
    }

    const newSkillsPayload: Array<Omit<Skill, 'id' | 'createdAt'>> = [];
    let duplicateSkillNames: string[] = [];

    for (const skill of skillsToSubmit) {
        if (existingSkillNames.map(name => name.toLowerCase()).includes(skill.name.toLowerCase())) {
            duplicateSkillNames.push(skill.name);
        } else {
            newSkillsPayload.push(skill);
        }
    }
    
    if (duplicateSkillNames.length > 0 && newSkillsPayload.length > 0) {
        const result = await Swal.fire({
            title: 'Skill Duplikat Terdeteksi',
            html: `Soft skill berikut sudah ada dan tidak akan ditambahkan lagi: <br/><strong>${duplicateSkillNames.join(', ')}</strong>.<br/>Lanjutkan menambahkan skill lainnya?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Lanjutkan',
            cancelButtonText: 'Batal',
        });
        if (!result.isConfirmed) {
             setIsSaving(false);
             return; 
        }
    } else if (duplicateSkillNames.length > 0 && newSkillsPayload.length === 0) {
         Swal.fire('Semua Skill Duplikat', `Soft skill berikut sudah ada: ${duplicateSkillNames.join(', ')}. Tidak ada skill baru untuk ditambahkan.`, 'info');
         setIsSaving(false);
         return;
    }
    
    if (newSkillsPayload.length === 0) {
        if (duplicateSkillNames.length === 0) {
             Swal.fire('Input Kosong', 'Tidak ada skill baru untuk ditambahkan setelah validasi.', 'warning');
        }
        setIsSaving(false);
        return;
    }

    setIsSaving(true);
    try {
      await addSoftSkills(newSkillsPayload);
      Swal.fire('Sukses!', 'Soft skill berhasil ditambahkan.', 'success');
      onAddSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to add soft skills:", err);
      Swal.fire('Error', err.message || 'Gagal menambahkan soft skill.', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  const getFilteredMasterSkills = (index: number) => {
    if(!searchTerms[index]) return [];
    return masterSkills.filter(ms => 
      ms.name.toLowerCase().includes(searchTerms[index].toLowerCase()) &&
      !existingSkillNames.map(name => name.toLowerCase()).includes(ms.name.toLowerCase()) && 
      !skillsToAdd.some((s, i) => i !== index && s.name.toLowerCase() === ms.name.toLowerCase()) 
    );
  }

  return (
    <div className="fixed inset-0  bg-opacity-40 backdrop-blur-md flex justify-center items-center z-[100] p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-lg max-h-[95vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gradient-to-r from-purple-200/50 to-pink-200/50">
          <div className="flex items-center">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 mr-4 shadow-lg">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                Tambah Soft Skill
              </h2>
              <p className="text-sm text-gray-600 mt-1">Tingkatkan profil keterampilan Anda</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="group p-2 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 hover:scale-110"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 space-y-6">
          {skillsToAdd.map((skill, index) => (
            <div 
              key={index} 
              className="group p-5 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl space-y-4 hover:shadow-lg hover:border-purple-300/60 transition-all duration-300 animate-fade-in-up" 
              style={{ animationDelay: `${index * 100}ms` }}
              ref={el => dropdownRefs.current[index] = el}
            >
              {/* Skill Name Input */}
              <div className="relative">
                <label htmlFor={`softskill-name-${index}`} className="block text-sm font-semibold text-purple-800 mb-2 flex items-center">
                  <Sparkles size={14} className="mr-1.5 text-purple-600" />
                  Nama Soft Skill
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={`softskill-name-${index}`}
                    value={searchTerms[index]}
                    onChange={(e) => handleSkillNameChange(index, e.target.value)}
                    onFocus={() => setShowDropdowns(prev => prev.map((s, i) => i === index ? true : s))}
                    placeholder="Ketik atau pilih soft skill"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-purple-200/60 bg-white/80 backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200/50 transition-all duration-300 placeholder-gray-400"
                    disabled={isSaving || isLoadingMasterSkills}
                    autoComplete="off"
                  />
                  
                  {/* Dropdown */}
                  {showDropdowns[index] && (
                    <>
                      {isLoadingMasterSkills && (
                        <div className="absolute z-20 w-full bg-white/95 backdrop-blur-sm border border-purple-200/60 rounded-xl mt-2 p-4 text-sm text-gray-500 shadow-xl animate-fade-in">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                            <span>Memuat daftar skill...</span>
                          </div>
                        </div>
                      )}
                      
                      {!isLoadingMasterSkills && getFilteredMasterSkills(index).length > 0 && (
                        <ul className="absolute z-20 w-full bg-white/95 backdrop-blur-sm border border-purple-200/60 rounded-xl mt-2 max-h-40 overflow-y-auto shadow-xl animate-fade-in">
                          {getFilteredMasterSkills(index).map(ms => (
                            <li 
                              key={ms.id} 
                              onClick={() => handleSelectMasterSkill(index, ms.name)}
                              className="px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all duration-200 border-b border-purple-100/50 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                            >
                              <div className="flex items-center">
                                <Brain size={14} className="mr-2 text-purple-500" />
                                {ms.name}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {!isLoadingMasterSkills && getFilteredMasterSkills(index).length === 0 && searchTerms[index] && (
                        <div className="absolute z-20 w-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-xl mt-2 p-4 text-sm text-green-700 shadow-xl animate-fade-in">
                          <div className="flex items-center">
                            <Star size={14} className="mr-2 text-green-600" />
                            <span>"{searchTerms[index]}" akan ditambahkan sebagai skill baru.</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Skill Level Select */}
              <div>
                <label htmlFor={`softskill-level-${index}`} className="block text-sm font-semibold text-purple-800 mb-2 flex items-center">
                  <Star size={14} className="mr-1.5 text-purple-600" />
                  Level Kemahiran
                </label>
                <div className="relative">
                  <select
                    id={`softskill-level-${index}`}
                    value={skill.level}
                    onChange={(e) => handleSkillLevelChange(index, e.target.value as Skill['level'])}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-purple-200/60 bg-white/80 backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200/50 appearance-none transition-all duration-300 cursor-pointer"
                    disabled={isSaving}
                  >
                    {skillLevels.map(level => (
                      <option key={level} value={level} className="py-2">{level}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Remove Skill Button */}
              {skillsToAdd.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeSkillField(index)} 
                  className="group flex items-center text-sm text-red-500 hover:text-red-700 transition-all duration-300 hover:scale-105"
                >
                  <X size={14} className="mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
                  Hapus Skill Ini
                </button>
              )}
            </div>
          ))}

          {/* Add More Skills Button */}
          <button 
            type="button" 
            onClick={addSkillField} 
            className="group flex items-center justify-center w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-dashed border-purple-300/50 hover:border-purple-400/60 rounded-2xl text-purple-600 hover:text-purple-700 transition-all duration-300 hover:scale-105"
            disabled={isSaving}
          >
            <PlusCircle size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Tambah Soft Skill Lain</span>
          </button>
        </form>
        
        {/* Footer Actions */}
        <div className="pt-6 mt-6 border-t border-gradient-to-r from-purple-200/50 to-pink-200/50 flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 hover:scale-105" 
            disabled={isSaving}
          >
            Batal
          </button>
          <button 
            type="submit" 
            formNoValidate 
            onClick={(e) => { e.preventDefault(); handleSubmit(e as any); }} 
            className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center disabled:opacity-60 hover:scale-105 hover:shadow-lg" 
            disabled={isSaving || isLoadingMasterSkills}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                Simpan Skill
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSoftSkillsForm;