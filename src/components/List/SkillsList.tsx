// src/components/list/SkillsList.tsx
import React from 'react';
import {type Skill } from '../../services/SkillsService';
import { PlusCircle, XCircle, Brain, Zap } from 'lucide-react'; // CheckSquare is not used, Info can be.
import Swal from 'sweetalert2';

interface SkillsListProps {
  softSkills: Skill[];
  hardSkills: Skill[];
  isLoadingSoft: boolean;
  isLoadingHard: boolean;
  errorSoft?: string | null;
  errorHard?: string | null;
  onAddSoftSkillClick: () => void;
  onAddHardSkillClick: () => void;
  onDeleteSoftSkill: (ids: string[]) => void; // API expects array of IDs
  onDeleteHardSkill: (ids: string[]) => void; // API expects array of IDs
}

const SkillItem: React.FC<{ skill: Skill; onDelete: () => void; type: 'soft' | 'hard' }> = ({ skill, onDelete, type }) => {
  return (
    <div className={`flex justify-between items-center p-2.5 pl-3 pr-2 rounded-md border transition-all duration-150 ease-in-out
      ${type === 'soft' ? 'bg-purple-50 border-purple-200 hover:border-purple-300 hover:shadow-sm' 
                       : 'bg-orange-50 border-orange-200 hover:border-orange-300 hover:shadow-sm'}`}
    >
      <div className="flex items-center overflow-hidden"> {/* Added overflow-hidden for long skill names */}
        {type === 'soft' ? <Brain size={16} className="mr-2 text-purple-600 flex-shrink-0" /> : <Zap size={16} className="mr-2 text-orange-600 flex-shrink-0" />}
        <span className="text-sm text-gray-700 mr-2 truncate">{skill.name}</span> {/* Added truncate */}
        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0
          ${type === 'soft' ? 'bg-purple-200 text-purple-800' : 'bg-orange-200 text-orange-800'}`}
        >
          {skill.level}
        </span>
      </div>
      <button 
        onClick={onDelete} 
        className={`p-1 rounded-full transition-colors ml-2 flex-shrink-0
          ${type === 'soft' ? 'text-purple-500 hover:bg-purple-200 hover:text-purple-700' 
                          : 'text-orange-500 hover:bg-orange-200 hover:text-orange-700'}`}
        aria-label={`Hapus ${skill.name}`}
      >
        <XCircle size={18} />
      </button>
    </div>
  );
};

const SkillsSection: React.FC<{
  title: string;
  skills: Skill[];
  isLoading: boolean;
  error?: string | null;
  onAddClick: () => void;
  onDeleteSkill: (id: string, name: string) => void; // Keep single ID for confirmation, batch delete in parent
  type: 'soft' | 'hard';
  icon: React.ElementType;
  emptyStateIcon: React.ElementType;
  colorClass: string;
  accentBgClass: string;
}> = ({ title, skills, isLoading, error, onAddClick, onDeleteSkill, type, icon: Icon, emptyStateIcon: EmptyIcon, colorClass, accentBgClass }) => {
  
  const handleDeleteWithConfirmation = (skill: Skill) => {
    Swal.fire({
      title: 'Anda yakin?',
      text: `Keterampilan "${skill.name}" akan dihapus!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-xl shadow-lg' }
    }).then((result) => {
      if (result.isConfirmed && skill.id) {
        onDeleteSkill(skill.id, skill.name); // Pass single ID to parent for deletion
      }
    });
  };

  if (isLoading) {
    return (
      <div className="mt-4 animate-pulse">
        <div className={`h-6 ${accentBgClass.replace('bg-', 'bg-gray-')} opacity-50 rounded w-2/5 mb-3`}></div>
        {[...Array(2)].map((_, i) => (
          <div key={i} className={`p-3 bg-gray-100 rounded-md border border-gray-200 mb-2`}>
            <div className={`h-4 ${accentBgClass.replace('bg-', 'bg-gray-')} opacity-40 rounded w-3/5`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className={`text-center text-red-600 ${accentBgClass.replace('bg-', 'bg-red-')} bg-opacity-20 p-3 rounded-lg shadow mt-3 text-sm`}>Error: {error}</div>;
  }

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className={`text-lg font-semibold ${colorClass} flex items-center`}><Icon size={20} className="mr-2" />{title}</h3>
        {/* Tombol tambah selalu ada, tapi mungkin style berbeda jika kosong */}
         <button
            onClick={onAddClick}
            className={`text-sm ${colorClass} hover:underline flex items-center font-medium p-1 rounded-md hover:${accentBgClass} hover:bg-opacity-30`}
          >
            <PlusCircle size={16} className="mr-1" /> Tambah
          </button>
      </div>
      {skills.length === 0 ? (
        <div className={`text-center py-10 px-4 ${accentBgClass} bg-opacity-20 border border-dashed ${colorClass.replace('text-', 'border-')} border-opacity-30 rounded-lg flex flex-col items-center justify-center min-h-[150px]`}>
          <button
            onClick={onAddClick}
            className={`flex flex-col items-center ${colorClass} hover:opacity-80 transition-opacity group`}
            aria-label={`Tambah ${title} Baru`}
          >
            <EmptyIcon size={40} className="mb-2 opacity-70 group-hover:opacity-90 transition-opacity" strokeWidth={1.5} />
            <span className="font-medium text-md">Tambah {title}</span>
            <span className="text-xs text-gray-500 group-hover:text-gray-600">Klik untuk menambahkan keterampilan.</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {skills.map(skill => (
            <SkillItem key={skill.id || skill.name} skill={skill} onDelete={() => handleDeleteWithConfirmation(skill)} type={type} />
          ))}
        </div>
      )}
    </div>
  );
};


const SkillsList: React.FC<SkillsListProps> = (props) => {
  return (
    <div className="mt-2">
      <SkillsSection 
        title="Soft Skills"
        skills={props.softSkills}
        isLoading={props.isLoadingSoft}
        error={props.errorSoft}
        onAddClick={props.onAddSoftSkillClick}
        onDeleteSkill={(id) => props.onDeleteSoftSkill([id])} // API expects array
        type="soft"
        icon={Brain}
        emptyStateIcon={Brain}
        colorClass="text-purple-600"
        accentBgClass="bg-purple-100"
      />
      <hr className="my-6 border-gray-200"/>
      <SkillsSection 
        title="Hard Skills"
        skills={props.hardSkills}
        isLoading={props.isLoadingHard}
        error={props.errorHard}
        onAddClick={props.onAddHardSkillClick}
        onDeleteSkill={(id) => props.onDeleteHardSkill([id])} // API expects array
        type="hard"
        icon={Zap}
        emptyStateIcon={Zap}
        colorClass="text-orange-600"
        accentBgClass="bg-orange-100"
      />
    </div>
  );
};

export default SkillsList;
