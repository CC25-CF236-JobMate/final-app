// src/components/AddForm/AddSoftSkillsForm.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent, useRef } from 'react';
import { type Skill, addSoftSkills, fetchMasterSoftSkills, skillLevels } from '../../services/SkillsService';
import Swal from 'sweetalert2';
import { Save, X, PlusCircle, Brain } from 'lucide-react';

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
    <div className="fixed inset-0  bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center"><Brain size={24} className="mr-2 text-purple-600" /> Tambah Soft Skill</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 custom-scrollbar-modal space-y-4">
          {skillsToAdd.map((skill, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-3 bg-gray-50/50" ref={el => dropdownRefs.current[index] = el}>
              <div className="relative">
                <label htmlFor={`softskill-name-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Nama Soft Skill</label>
                <input
                  type="text"
                  id={`softskill-name-${index}`}
                  value={searchTerms[index]}
                  onChange={(e) => handleSkillNameChange(index, e.target.value)}
                  onFocus={() => setShowDropdowns(prev => prev.map((s, i) => i === index ? true : s))}
                  placeholder="Ketik atau pilih soft skill"
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isSaving || isLoadingMasterSkills}
                  autoComplete="off"
                />
                {showDropdowns[index] && (
                    <>
                        {isLoadingMasterSkills && <div className="absolute z-20 w-full text-center bg-white border border-gray-300 rounded-md mt-1 p-2 text-sm text-gray-500 shadow-lg">Memuat daftar skill...</div>}
                        {!isLoadingMasterSkills && getFilteredMasterSkills(index).length > 0 && (
                          <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                            {getFilteredMasterSkills(index).map(ms => (
                              <li 
                                key={ms.id} 
                                onClick={() => handleSelectMasterSkill(index, ms.name)}
                                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                              >
                                {ms.name}
                              </li>
                            ))}
                          </ul>
                        )}
                         {!isLoadingMasterSkills && getFilteredMasterSkills(index).length === 0 && searchTerms[index] && (
                             <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 p-2 text-sm text-gray-500 shadow-lg">
                                "{searchTerms[index]}" akan ditambahkan sebagai skill baru.
                            </div>
                         )}
                    </>
                )}
              </div>
              <div>
                <label htmlFor={`softskill-level-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Level Kemahiran</label>
                <select
                  id={`softskill-level-${index}`}
                  value={skill.level}
                  onChange={(e) => handleSkillLevelChange(index, e.target.value as Skill['level'])}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                  disabled={isSaving}
                >
                  {skillLevels.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
              {skillsToAdd.length > 1 && (
                <button type="button" onClick={() => removeSkillField(index)} className="text-xs text-red-500 hover:text-red-700">Hapus Skill Ini</button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addSkillField} 
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
            disabled={isSaving}
          >
            <PlusCircle size={16} className="mr-1" /> Tambah Soft Skill Lain
          </button>
        </form>
        
        <div className="pt-5 border-t mt-auto flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition" disabled={isSaving}>Batal</button>
            <button type="submit" formNoValidate onClick={(e) => { e.preventDefault(); handleSubmit(e as any); }} className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-5 rounded-lg transition flex items-center disabled:opacity-60" disabled={isSaving || isLoadingMasterSkills}>
              {isSaving ? <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Menyimpan...</> : <><Save size={16} className="mr-1.5" />Simpan</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddSoftSkillsForm;
