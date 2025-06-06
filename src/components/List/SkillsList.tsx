// src/components/list/SkillsList.tsx
import React from 'react';
import {type Skill } from '../../services/SkillsService';
import { PlusCircle, XCircle, Brain, Zap, Star, Sparkles } from 'lucide-react';
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
  onDeleteSoftSkill: (ids: string[]) => void;
  onDeleteHardSkill: (ids: string[]) => void;
}

const SkillItem: React.FC<{ skill: Skill; onDelete: () => void; type: 'soft' | 'hard' }> = ({ skill, onDelete, type }) => {
  const gradientClasses = type === 'soft' 
    ? 'from-purple-500 to-pink-600' 
    : 'from-orange-500 to-red-600';
  
  const bgClasses = type === 'soft'
    ? 'bg-gradient-to-r from-purple-50 to-pink-50/50 border-purple-200/60 hover:border-purple-300/80'
    : 'bg-gradient-to-r from-orange-50 to-red-50/50 border-orange-200/60 hover:border-orange-300/80';

  const iconClasses = type === 'soft' ? 'text-purple-600' : 'text-orange-600';
  const levelClasses = type === 'soft' 
    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200/50'
    : 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200/50';

  return (
    <div className={`group flex justify-between items-center p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] ${bgClasses}`}>
      <div className="flex items-center overflow-hidden flex-1 min-w-0">
        <div className={`p-2 rounded-xl bg-gradient-to-r ${gradientClasses} mr-3 flex-shrink-0 shadow-sm`}>
          {type === 'soft' ? 
            <Brain size={16} className="text-white" /> : 
            <Zap size={16} className="text-white" />
          }
        </div>
        <div className="flex-1 min-w-0 mr-3">
          <span className="text-sm font-medium text-gray-800 block truncate">{skill.name}</span>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full flex-shrink-0 font-medium ${levelClasses}`}>
          {skill.level}
        </span>
      </div>
      <button 
        onClick={onDelete} 
        className={`p-2 rounded-xl transition-all duration-300 ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 hover:scale-110 ${type === 'soft' ? 'text-purple-500 hover:bg-purple-100/80' : 'text-orange-500 hover:bg-orange-100/80'}`}
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
  onDeleteSkill: (id: string, name: string) => void;
  type: 'soft' | 'hard';
  icon: React.ElementType;
  emptyStateIcon: React.ElementType;
  gradientClass: string;
  colorClass: string;
}> = ({ title, skills, isLoading, error, onAddClick, onDeleteSkill, type, icon: Icon, emptyStateIcon: EmptyIcon, gradientClass, colorClass }) => {
  
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
      customClass: { 
        popup: 'rounded-2xl shadow-2xl',
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl'
      }
    }).then((result) => {
      if (result.isConfirmed && skill.id) {
        onDeleteSkill(skill.id, skill.name);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-40 animate-pulse"></div>
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-24 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
        <div className="text-red-600 font-medium mb-2">Terjadi Kesalahan</div>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`p-3 rounded-2xl bg-gradient-to-r ${gradientClass} mr-4 shadow-lg`}>
            <Icon size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{skills.length} keterampilan terdaftar</p>
          </div>
        </div>
        <button
          onClick={onAddClick}
          className={`group flex items-center px-6 py-3 bg-gradient-to-r ${gradientClass} text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          <PlusCircle size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Tambah
        </button>
      </div>

      {/* Skills Content */}
      {skills.length === 0 ? (
        <div className="relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className={`relative text-center py-16 px-8 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm border-2 border-dashed ${colorClass.replace('text-', 'border-')} border-opacity-30 rounded-3xl transition-all duration-300 hover:border-opacity-50 hover:shadow-xl`}>
            <button
              onClick={onAddClick}
              className={`group flex flex-col items-center justify-center w-full ${colorClass} hover:opacity-90 transition-all duration-300`}
              aria-label={`Tambah ${title} Baru`}
            >
              {/* Floating icons animation */}
              <div className="relative mb-6">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce delay-100 opacity-80">
                  <Star size={10} className="text-white m-0.5 fill-current" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-bounce delay-300 opacity-80">
                  <Sparkles size={10} className="text-white m-0.5" />
                </div>
                <div className={`p-6 rounded-3xl bg-gradient-to-r ${gradientClass} shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                  <EmptyIcon size={48} className="text-white" strokeWidth={1.5} />
                </div>
              </div>
              
              <h4 className="font-bold text-xl mb-2 group-hover:scale-105 transition-transform duration-300">
                Tambah {title} Pertama
              </h4>
              <p className="text-gray-600 max-w-sm leading-relaxed">
                Mulai membangun profil keterampilan Anda dengan menambahkan {title.toLowerCase()} yang relevan
              </p>
              
              {/* Call-to-action indicator */}
              <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                <span>Klik untuk memulai</span>
                <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-500"></div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div key={skill.id || skill.name} 
                 className="animate-fade-in-up" 
                 style={{ animationDelay: `${index * 100}ms` }}>
              <SkillItem 
                skill={skill} 
                onDelete={() => handleDeleteWithConfirmation(skill)} 
                type={type} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SkillsList: React.FC<SkillsListProps> = (props) => {
  return (
    <div className="space-y-12">
      {/* Soft Skills Section */}
      <SkillsSection 
        title="Soft Skills"
        skills={props.softSkills}
        isLoading={props.isLoadingSoft}
        error={props.errorSoft}
        onAddClick={props.onAddSoftSkillClick}
        onDeleteSkill={(id) => props.onDeleteSoftSkill([id])}
        type="soft"
        icon={Brain}
        emptyStateIcon={Brain}
        gradientClass="from-purple-500 to-pink-600"
        colorClass="text-purple-600"
      />
      
      {/* Elegant Separator */}
      <div className="relative flex items-center justify-center py-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
        <div className="relative bg-white px-6">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-orange-400 rounded-full"></div>
            <Sparkles size={16} className="text-gray-400" />
            <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-purple-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Hard Skills Section */}
      <SkillsSection 
        title="Hard Skills"
        skills={props.hardSkills}
        isLoading={props.isLoadingHard}
        error={props.errorHard}
        onAddClick={props.onAddHardSkillClick}
        onDeleteSkill={(id) => props.onDeleteHardSkill([id])}
        type="hard"
        icon={Zap}
        emptyStateIcon={Zap}
        gradientClass="from-orange-500 to-red-600"
        colorClass="text-orange-600"
      />
    </div>
  );
};

export default SkillsList;