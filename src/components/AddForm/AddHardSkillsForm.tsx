// src/components/AddForm/AddHardSkillsForm.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent, useRef } from 'react';
import { type Skill, addHardSkills, fetchMasterHardSkills, skillLevels } from '../../services/SkillsService';
import Swal from 'sweetalert2';
import { Save, X, PlusCircle, Zap, Sparkles, Star, ChevronDown } from 'lucide-react';

interface AddHardSkillsFormProps {
  onClose: () => void;
  onAddSuccess: () => void;
  existingSkillNames: string[];
}

interface MasterSkillOption {
  id: string;
  name: string;
}

const AddHardSkillsForm: React.FC<AddHardSkillsFormProps> = ({ onClose, onAddSuccess, existingSkillNames }) => {
  const [skillsToAdd, setSkillsToAdd] = useState<Array<Omit<Skill, 'id' | 'createdAt'>>>([{ name: '', level: skillLevels[0] }]);
  const [masterSkills, setMasterSkills] = useState<MasterSkillOption[]>([]);
  const [searchTerms, setSearchTerms] = useState<string[]>(['']);
  const [showDropdowns, setShowDropdowns] = useState<boolean[]>([false]);
  const formRef = useRef<HTMLFormElement>(null);

  const [isLoadingMasterSkills, setIsLoadingMasterSkills] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadMasterSkills = async () => {
      setIsLoadingMasterSkills(true);
      try {
        const fetchedMasterSkills = await fetchMasterHardSkills();
        setMasterSkills(fetchedMasterSkills);
      } catch (error) {
        console.error("Failed to load master hard skills:", error);
      } finally {
        setIsLoadingMasterSkills(false);
      }
    };
    loadMasterSkills();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowDropdowns(prev => prev.map(() => false));
      }
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
    handleSkillNameChange(index, skillName);
    const updatedShowDropdowns = [...showDropdowns];
    updatedShowDropdowns[index] = false;
    setShowDropdowns(updatedShowDropdowns);
  };

  const addSkillField = () => {
    setSkillsToAdd([...skillsToAdd, { name: '', level: skillLevels[0] }]);
    setSearchTerms([...searchTerms, '']);
    setShowDropdowns([...showDropdowns, false]);
  };

  const removeSkillField = (index: number) => {
    if (skillsToAdd.length <= 1) return;
    setSkillsToAdd(skillsToAdd.filter((_, i) => i !== index));
    setSearchTerms(searchTerms.filter((_, i) => i !== index));
    setShowDropdowns(showDropdowns.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const skillsToSubmit = skillsToAdd.map(skill => ({ ...skill, name: skill.name.trim() })).filter(skill => skill.name !== '' && skill.level.trim() !== '');

    if (skillsToSubmit.length === 0) {
      Swal.fire({
        title: 'Input Kosong',
        text: 'Mohon isi setidaknya satu hard skill.',
        icon: 'warning',
        customClass: { 
          popup: 'rounded-2xl shadow-2xl',
          confirmButton: 'rounded-xl'
        }
      });
      return;
    }
    
    const newSkillsPayload = skillsToSubmit.filter(s => !existingSkillNames.map(n => n.toLowerCase()).includes(s.name.toLowerCase()));
    
    if (newSkillsPayload.length !== skillsToSubmit.length) {
      Swal.fire({
        title: 'Skill Duplikat',
        text: 'Beberapa skill yang Anda masukkan sudah ada dan tidak akan ditambahkan lagi.',
        icon: 'info',
        customClass: { 
          popup: 'rounded-2xl shadow-2xl',
          confirmButton: 'rounded-xl'
        }
      });
    }

    if (newSkillsPayload.length === 0) {
      setIsSaving(false);
      return;
    }

    setIsSaving(true);
    try {
      await addHardSkills(newSkillsPayload);
      Swal.fire({
        title: 'Sukses!',
        text: 'Hard skill berhasil ditambahkan.',
        icon: 'success',
        customClass: { 
          popup: 'rounded-2xl shadow-2xl',
          confirmButton: 'rounded-xl'
        }
      });
      onAddSuccess();
      onClose();
    } catch (err: any) {
      Swal.fire({
        title: 'Error',
        text: err.message || 'Gagal menambahkan hard skill.',
        icon: 'error',
        customClass: { 
          popup: 'rounded-2xl shadow-2xl',
          confirmButton: 'rounded-xl'
        }
      });
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-r from-orange-200/40 to-red-200/40 rounded-full blur-2xl"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 bg-gradient-to-r from-red-200/40 to-orange-200/40 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-orange-200/20 to-red-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-lg border border-orange-200/60 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gradient-to-r from-orange-200/30 to-red-200/30">
            <div className="flex items-center">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 mr-4 shadow-lg">
                <Zap size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Tambah Hard Skill</h2>
                <p className="text-sm text-gray-600 mt-1">Tingkatkan kemampuan teknis Anda</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-orange-100/80 transition-all duration-300 hover:scale-110"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 space-y-6">
            {skillsToAdd.map((skill, index) => (
              <div key={index} className="group p-6 bg-gradient-to-r from-orange-50/80 to-red-50/80 border border-orange-200/60 rounded-2xl space-y-4 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-orange-300/80">
                {/* Skill Name Input */}
                <div className="relative">
                  <label htmlFor={`hardskill-name-${index}`} className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Star size={14} className="mr-2 text-orange-500" />
                    Nama Hard Skill
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id={`hardskill-name-${index}`}
                      value={searchTerms[index]}
                      onChange={(e) => handleSkillNameChange(index, e.target.value)}
                      onFocus={() => setShowDropdowns(prev => prev.map((s, i) => i === index ? true : false))}
                      placeholder="Ketik atau pilih hard skill"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-orange-200/60 bg-white/80 backdrop-blur-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 transition-all duration-300 hover:border-orange-300/80"
                      disabled={isSaving || isLoadingMasterSkills}
                      autoComplete="off"
                    />
                    <Sparkles size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 opacity-60" />
                  </div>
                  
                  {showDropdowns[index] && (
                    <div className="absolute z-20 w-full mt-2">
                      <ul className="bg-white/95 backdrop-blur-sm border border-orange-200/60 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {isLoadingMasterSkills ? (
                          <li className="px-4 py-3 text-sm text-gray-400 flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-3"></div>
                            Memuat...
                          </li>
                        ) : getFilteredMasterSkills(index).length > 0 ? (
                          getFilteredMasterSkills(index).map(ms => (
                            <li 
                              key={ms.id} 
                              onClick={() => handleSelectMasterSkill(index, ms.name)} 
                              className="px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 cursor-pointer transition-all duration-200 flex items-center group"
                            >
                              <Zap size={14} className="mr-3 text-orange-500 group-hover:text-orange-600" />
                              {ms.name}
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-3 text-sm text-gray-500 flex items-center">
                            <PlusCircle size={14} className="mr-3 text-orange-500" />
                            "{searchTerms[index]}" akan ditambahkan sebagai skill baru
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Skill Level Select */}
                <div className="relative">
                  <label htmlFor={`hardskill-level-${index}`} className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Sparkles size={14} className="mr-2 text-orange-500" />
                    Level Kemahiran
                  </label>
                  <div className="relative">
                    <select 
                      id={`hardskill-level-${index}`} 
                      value={skill.level} 
                      onChange={(e) => handleSkillLevelChange(index, e.target.value as Skill['level'])} 
                      className="w-full px-4 py-3 text-sm rounded-xl border border-orange-200/60 bg-white/80 backdrop-blur-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 transition-all duration-300 hover:border-orange-300/80 appearance-none cursor-pointer" 
                      disabled={isSaving}
                    >
                      {skillLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 pointer-events-none" />
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200/50 inline-block mt-2 font-medium">
                    {skill.level}
                  </span>
                </div>

                {/* Remove Button */}
                {skillsToAdd.length > 1 && (
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => removeSkillField(index)} 
                      className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center"
                    >
                      <X size={14} className="mr-1" />
                      Hapus Skill Ini
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add More Skills Button */}
            <button 
              type="button" 
              onClick={addSkillField} 
              className="w-full p-4 border-2 border-dashed border-orange-300/60 rounded-2xl text-orange-600 hover:border-orange-400/80 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 transition-all duration-300 flex items-center justify-center group" 
              disabled={isSaving}
            >
              <PlusCircle size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">Tambah Hard Skill Lain</span>
            </button>
          </form>
          
          {/* Footer Actions */}
          <div className="pt-6 border-t border-gradient-to-r from-orange-200/30 to-red-200/30 mt-6 flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50" 
              disabled={isSaving}
            >
              Batal
            </button>
            <button 
              type="submit" 
              onClick={(e) => { e.preventDefault(); handleSubmit(e as any); }} 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center disabled:opacity-60 hover:scale-105 shadow-lg hover:shadow-xl" 
              disabled={isSaving || isLoadingMasterSkills}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHardSkillsForm;