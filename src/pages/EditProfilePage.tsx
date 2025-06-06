// src/pages/EditProfilePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileList from '../components/List/ProfileList';
import EditProfileForm from '../components/EditForm/EditProfileForm';
import EducationList from '../components/List/EducationList';
import AddEducationForm from '../components/AddForm/AddEducationForm';
import EditEducationForm from '../components/EditForm/EditEducationForm';
import ExperienceList from '../components/List/ExperienceList';
import AddExperienceForm from '../components/AddForm/AddExperienceForm';
import EditExperienceForm from '../components/EditForm/EditExperienceForm';
import SkillsList from '../components/List/SkillsList';
import AddSoftSkillsForm from '../components/AddForm/AddSoftSkillsForm';
import AddHardSkillsForm from '../components/AddForm/AddHardSkillsForm';
import PortfolioList from '../components/List/PortfolioList';
import AddPortfolioForm from '../components/AddForm/AddPortfolioForm';
import EditPortfolioForm from '../components/EditForm/EditPortFolioForm';
import DocumentList from '../components/List/DocumentsList';
import AddDocumentForm from '../components/AddForm/AddDocumentsForm';
import EditDocumentForm from '../components/EditForm/EditDocumentForm';
import PreferenceList from '../components/List/PreferencesList';
import AddPreferenceForm from '../components/AddForm/AddPreferencesForm';
import EditPreferenceForm from '../components/EditForm/EditPreferenceForm';

import { fetchProfile } from '../services/ProfileService';
import { getEducation, type EducationData, deleteEducation } from '../services/EducationService';
import { getExperience, type ExperienceData, deleteExperience } from '../services/ExperienceService';
import { getUserSoftSkills, getUserHardSkills, deleteSoftSkills, deleteHardSkills, type Skill } from '../services/SkillsService';
import { getPortfolioProjects, type PortfolioProject, deletePortfolioProject } from '../services/PortfolioService';
import { getDocuments, type DocumentData as UserDocumentData, deleteDocument } from '../services/DocumentService';
import { getPreferences, type PreferenceData } from '../services/PreferenceService';

import { ChevronLeft, User, BookText, Briefcase as BriefcaseIcon, Star, Layers as LayersIcon, FileText as FileTextIcon, Target as TargetIcon, Settings, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

interface ProfileData {
  uid?: string;
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
  email?: string;
}

type ActiveTab = 'profile' | 'education' | 'experience' | 'skills' | 'portfolio' | 'documents' | 'preferences';

const EditProfilePage: React.FC = () => {
  // All state declarations
  const [currentProfile, setCurrentProfile] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const [educationList, setEducationList] = useState<EducationData[]>([]);
  const [isLoadingEducation, setIsLoadingEducation] = useState(true);
  const [educationError, setEducationError] = useState<string | null>(null);
  const [isAddEducationModalOpen, setIsAddEducationModalOpen] = useState(false);
  const [isEditEducationModalOpen, setIsEditEducationModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<EducationData | null>(null);

  const [experienceList, setExperienceList] = useState<ExperienceData[]>([]);
  const [isLoadingExperience, setIsLoadingExperience] = useState(true);
  const [experienceError, setExperienceError] = useState<string | null>(null);
  const [isAddExperienceModalOpen, setIsAddExperienceModalOpen] = useState(false);
  const [isEditExperienceModalOpen, setIsEditExperienceModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceData | null>(null);

  const [softSkills, setSoftSkills] = useState<Skill[]>([]);
  const [hardSkills, setHardSkills] = useState<Skill[]>([]);
  const [isLoadingSoftSkills, setIsLoadingSoftSkills] = useState(true);
  const [isLoadingHardSkills, setIsLoadingHardSkills] = useState(true);
  const [softSkillsError, setSoftSkillsError] = useState<string | null>(null);
  const [hardSkillsError, setHardSkillsError] = useState<string | null>(null);
  const [isAddSoftSkillModalOpen, setIsAddSoftSkillModalOpen] = useState(false);
  const [isAddHardSkillModalOpen, setIsAddHardSkillModalOpen] = useState(false);

  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [isAddPortfolioModalOpen, setIsAddPortfolioModalOpen] = useState(false);
  const [isEditPortfolioModalOpen, setIsEditPortfolioModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioProject | null>(null);

  const [userDocuments, setUserDocuments] = useState<UserDocumentData[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [isEditDocumentModalOpen, setIsEditDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<UserDocumentData | null>(null);

  const [preferences, setPreferences] = useState<PreferenceData | null>(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const [isAddPreferenceModalOpen, setIsAddPreferenceModalOpen] = useState(false);
  const [isEditPreferenceModalOpen, setIsEditPreferenceModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  // Data Fetching Callbacks
  const loadProfileData = useCallback(async () => { setIsLoadingProfile(true); setProfileError(null); try { setCurrentProfile(await fetchProfile()); } catch (e:any) { setProfileError(e.message); } finally { setIsLoadingProfile(false); }}, []);
  const loadEducationData = useCallback(async () => { setIsLoadingEducation(true); setEducationError(null); try { setEducationList(await getEducation()); } catch (e:any) { setEducationError(e.message); } finally { setIsLoadingEducation(false); }}, []);
  const loadExperienceData = useCallback(async () => { setIsLoadingExperience(true); setExperienceError(null); try { setExperienceList(await getExperience()); } catch (e:any) { setExperienceError(e.message); } finally { setIsLoadingExperience(false); }}, []);
  const loadSoftSkillsData = useCallback(async () => { setIsLoadingSoftSkills(true); setSoftSkillsError(null); try { setSoftSkills(await getUserSoftSkills()); } catch (e:any) { setSoftSkillsError(e.message); } finally { setIsLoadingSoftSkills(false); }}, []);
  const loadHardSkillsData = useCallback(async () => { setIsLoadingHardSkills(true); setHardSkillsError(null); try { setHardSkills(await getUserHardSkills()); } catch (e:any) { setHardSkillsError(e.message); } finally { setIsLoadingHardSkills(false); }}, []);
  const loadPortfolioData = useCallback(async () => { setIsLoadingPortfolio(true); setPortfolioError(null); try { setPortfolioProjects(await getPortfolioProjects()); } catch (e:any) { setPortfolioError(e.message); } finally { setIsLoadingPortfolio(false); }}, []);
  const loadDocumentsData = useCallback(async () => { setIsLoadingDocuments(true); setDocumentsError(null); try { setUserDocuments(await getDocuments()); } catch (e:any) { setDocumentsError(e.message); } finally { setIsLoadingDocuments(false); }}, []);
  const loadPreferencesData = useCallback(async () => { setIsLoadingPreferences(true); setPreferencesError(null); try { const data = await getPreferences(); setPreferences(data ? data.preferences : null); } catch (e:any) { setPreferencesError(e.message); } finally { setIsLoadingPreferences(false); }}, []);

  useEffect(() => {
    loadProfileData();
    loadEducationData();
    loadExperienceData();
    loadSoftSkillsData();
    loadHardSkillsData();
    loadPortfolioData();
    loadDocumentsData();
    loadPreferencesData();
  }, [loadProfileData, loadEducationData, loadExperienceData, loadSoftSkillsData, loadHardSkillsData, loadPortfolioData, loadDocumentsData, loadPreferencesData]);

  // All event handlers
  const handleOpenEditProfileModal = () => currentProfile ? setIsEditProfileModalOpen(true) : Swal.fire('Info', 'Data profil belum dimuat.', 'info');
  const handleCloseEditProfileModal = () => setIsEditProfileModalOpen(false);
  const handleProfileSaveSuccess = (updatedData: ProfileData) => {setCurrentProfile(updatedData); loadProfileData();};
  const handleOpenAddEducationModal = () => setIsAddEducationModalOpen(true);
  const handleCloseAddEducationModal = () => setIsAddEducationModalOpen(false);
  const handleAddEducationSuccess = () => loadEducationData();
  const handleOpenEditEducationModal = (edu: EducationData) => { setSelectedEducation(edu); setIsEditEducationModalOpen(true); };
  const handleCloseEditEducationModal = () => { setSelectedEducation(null); setIsEditEducationModalOpen(false); };
  const handleUpdateEducationSuccess = () => loadEducationData();
  const handleDeleteEducation = async (id: string) => { try { await deleteEducation(id); Swal.fire('Dihapus!', 'Riwayat pendidikan dihapus.', 'success'); loadEducationData(); } catch (e:any) { Swal.fire('Error', e.message, 'error'); }};
  const handleOpenAddExperienceModal = () => setIsAddExperienceModalOpen(true);
  const handleCloseAddExperienceModal = () => setIsAddExperienceModalOpen(false);
  const handleAddExperienceSuccess = () => loadExperienceData();
  const handleOpenEditExperienceModal = (exp: ExperienceData) => { setSelectedExperience(exp); setIsEditExperienceModalOpen(true); };
  const handleCloseEditExperienceModal = () => { setSelectedExperience(null); setIsEditExperienceModalOpen(false); };
  const handleUpdateExperienceSuccess = () => loadExperienceData();
  const handleDeleteExperience = async (id: string) => { try { await deleteExperience(id); Swal.fire('Dihapus!', 'Pengalaman kerja dihapus.', 'success'); loadExperienceData(); } catch (e:any) { Swal.fire('Error', e.message, 'error'); }};
  const handleOpenAddSoftSkillModal = () => setIsAddSoftSkillModalOpen(true);
  const handleCloseAddSoftSkillModal = () => setIsAddSoftSkillModalOpen(false);
  const handleAddSoftSkillSuccess = () => loadSoftSkillsData();
  const handleDeleteSoftSkill = async (ids: string[]) => { try { await deleteSoftSkills(ids); Swal.fire('Dihapus!', 'Soft skill dihapus.', 'success'); loadSoftSkillsData(); } catch (e:any) { Swal.fire('Error', e.message, 'error'); }};
  const handleOpenAddHardSkillModal = () => setIsAddHardSkillModalOpen(true);
  const handleCloseAddHardSkillModal = () => setIsAddHardSkillModalOpen(false);
  const handleAddHardSkillSuccess = () => loadHardSkillsData();
  const handleDeleteHardSkill = async (ids: string[]) => { try { await deleteHardSkills(ids); Swal.fire('Dihapus!', 'Hard skill dihapus.', 'success'); loadHardSkillsData(); } catch (e:any) { Swal.fire('Error', e.message, 'error'); }};
  const handleOpenAddPortfolioModal = () => setIsAddPortfolioModalOpen(true);
  const handleCloseAddPortfolioModal = () => setIsAddPortfolioModalOpen(false);
  const handleAddPortfolioSuccess = () => loadPortfolioData();
  const handleOpenEditPortfolioModal = (project: PortfolioProject) => { setSelectedPortfolio(project); setIsEditPortfolioModalOpen(true); };
  const handleCloseEditPortfolioModal = () => { setSelectedPortfolio(null); setIsEditPortfolioModalOpen(false); };
  const handleUpdatePortfolioSuccess = () => loadPortfolioData();
  const handleDeletePortfolio = async (id: string) => { try { await deletePortfolioProject(id); Swal.fire('Dihapus!', 'Proyek portfolio dihapus.', 'success'); loadPortfolioData(); } catch (e:any) { Swal.fire('Error', e.message, 'error'); }};
  const handleOpenAddDocumentModal = () => setIsAddDocumentModalOpen(true);
  const handleCloseAddDocumentModal = () => setIsAddDocumentModalOpen(false);
  const handleAddDocumentSuccess = () => loadDocumentsData();
  const handleOpenEditDocumentModal = (doc: UserDocumentData) => { setSelectedDocument(doc); setIsEditDocumentModalOpen(true); };
  const handleCloseEditDocumentModal = () => { setSelectedDocument(null); setIsEditDocumentModalOpen(false); };
  const handleUpdateDocumentSuccess = () => loadDocumentsData();
  const handleDeleteDocument = async (id: string) => { try { await deleteDocument(id); Swal.fire('Dihapus!', 'Dokumen telah dihapus.', 'success'); loadDocumentsData(); } catch (e:any) { Swal.fire('Error', e.message, 'error'); }};

  // Preference Handlers
  const handleOpenAddPreferenceModal = () => setIsAddPreferenceModalOpen(true);
  const handleCloseAddPreferenceModal = () => setIsAddPreferenceModalOpen(false);
  const handleAddPreferenceSuccess = () => loadPreferencesData();
  const handleOpenEditPreferenceModal = () => { if (preferences) setIsEditPreferenceModalOpen(true); else handleOpenAddPreferenceModal(); };
  const handleCloseEditPreferenceModal = () => setIsEditPreferenceModalOpen(false);
  const handleUpdatePreferenceSuccess = () => loadPreferencesData();

  const tabs = [
    { id: 'profile', label: 'Profil Saya', icon: User, color: 'from-blue-500 to-purple-600' },
    { id: 'education', label: 'Pendidikan', icon: BookText, color: 'from-green-500 to-teal-600' },
    { id: 'experience', label: 'Pengalaman', icon: BriefcaseIcon, color: 'from-orange-500 to-red-600' },
    { id: 'skills', label: 'Keterampilan', icon: Star, color: 'from-yellow-500 to-orange-600' },
    { id: 'portfolio', label: 'Portfolio', icon: LayersIcon, color: 'from-purple-500 to-pink-600' },
    { id: 'documents', label: 'Dokumen', icon: FileTextIcon, color: 'from-indigo-500 to-blue-600' },
    { id: 'preferences', label: 'Preferensi', icon: TargetIcon, color: 'from-pink-500 to-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50/30 flex flex-col">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {/* Enhanced header with floating icons */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-400/80 rounded-2xl flex items-center justify-center animate-bounce delay-100">
                  <TrendingUp size={16} className="text-green-800" />
                </div>
                <div className="absolute -top-2 -right-6 w-6 h-6 bg-pink-400/80 rounded-full flex items-center justify-center animate-bounce delay-300">
                  <Heart size={12} className="text-pink-800 fill-current" />
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-blue-400/80 rounded-xl flex items-center justify-center animate-bounce delay-500">
                  <Star size={14} className="text-blue-800 fill-current" />
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
                  <Settings size={48} className="text-white" strokeWidth={1.5} />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Pengaturan
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Akun
                </span>
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
                Kelola dan perbarui informasi profil, pengalaman, keterampilan, dan preferensi karir Anda
              </p>
            </div>
            
            {/* Back to Home Button - Enhanced */}
            <Link 
              to="/" 
              className="hidden md:inline-flex items-center text-sm text-white hover:text-blue-200 transition-all duration-300 group py-3 px-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105"
            >
              <ChevronLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Kembali ke Beranda 
            </Link>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-20 text-blue-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 -mt-8 md:-mt-12 relative z-10">
        {/* Mobile Back Button */}
        <div className="md:hidden mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors group py-2 px-4 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100"
          >
            <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Beranda 
          </Link>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/50">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`whitespace-nowrap py-3 px-4 rounded-xl font-medium text-sm flex items-center transition-all duration-300 min-w-fit
                  ${activeTab === tab.id 
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105` 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/80'}`}
              >
                <tab.icon size={16} className="mr-2 flex-shrink-0" /> 
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Enhanced Content Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {activeTab === 'profile' && <ProfileList profile={currentProfile} isLoading={isLoadingProfile} error={profileError} onEditClick={handleOpenEditProfileModal} />}
          {activeTab === 'education' && <div className="p-6 md:p-8"><EducationList educationRecords={educationList} isLoading={isLoadingEducation} error={educationError} onAddClick={handleOpenAddEducationModal} onEditClick={handleOpenEditEducationModal} onDeleteClick={handleDeleteEducation} /></div>}
          {activeTab === 'experience' && <div className="p-6 md:p-8"><ExperienceList experienceRecords={experienceList} isLoading={isLoadingExperience} error={experienceError} onAddClick={handleOpenAddExperienceModal} onEditClick={handleOpenEditExperienceModal} onDeleteClick={handleDeleteExperience} /></div>}
          {activeTab === 'skills' && <div className="p-6 md:p-8"><SkillsList softSkills={softSkills} hardSkills={hardSkills} isLoadingSoft={isLoadingSoftSkills} isLoadingHard={isLoadingHardSkills} errorSoft={softSkillsError} errorHard={hardSkillsError} onAddSoftSkillClick={handleOpenAddSoftSkillModal} onAddHardSkillClick={handleOpenAddHardSkillModal} onDeleteSoftSkill={handleDeleteSoftSkill} onDeleteHardSkill={handleDeleteHardSkill} /></div>}
          {activeTab === 'portfolio' && <div className="p-6 md:p-8"><PortfolioList portfolioProjects={portfolioProjects} isLoading={isLoadingPortfolio} error={portfolioError} onAddClick={handleOpenAddPortfolioModal} onEditClick={handleOpenEditPortfolioModal} onDeleteClick={handleDeletePortfolio} /></div>}
          {activeTab === 'documents' && <div className="p-6 md:p-8"><DocumentList documents={userDocuments} isLoading={isLoadingDocuments} error={documentsError} onAddClick={handleOpenAddDocumentModal} onEditClick={handleOpenEditDocumentModal} onDeleteClick={handleDeleteDocument} /></div>}
          {activeTab === 'preferences' && <div className="p-6 md:p-8"><PreferenceList preferences={preferences} isLoading={isLoadingPreferences} error={preferencesError} onAddClick={handleOpenAddPreferenceModal} onEditClick={handleOpenEditPreferenceModal} /></div>}
        </div>

        {/* Decorative elements */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 text-gray-500">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <Sparkles size={16} className="text-purple-400" />
            <span className="text-sm font-medium">Profil yang lengkap meningkatkan peluang karir Anda!</span>
            <Sparkles size={16} className="text-indigo-400" />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
        </div>

        {/* Modals */}
        {isEditProfileModalOpen && currentProfile && <EditProfileForm initialData={currentProfile} onClose={handleCloseEditProfileModal} onSaveSuccess={handleProfileSaveSuccess} />}
        {isAddEducationModalOpen && <AddEducationForm onClose={handleCloseAddEducationModal} onAddSuccess={handleAddEducationSuccess} />}
        {isEditEducationModalOpen && selectedEducation && <EditEducationForm initialData={selectedEducation} onClose={handleCloseEditEducationModal} onUpdateSuccess={handleUpdateEducationSuccess} />}
        {isAddExperienceModalOpen && <AddExperienceForm onClose={handleCloseAddExperienceModal} onAddSuccess={handleAddExperienceSuccess} />}
        {isEditExperienceModalOpen && selectedExperience && <EditExperienceForm initialData={selectedExperience} onClose={handleCloseEditExperienceModal} onUpdateSuccess={handleUpdateExperienceSuccess} />}
        {isAddSoftSkillModalOpen && <AddSoftSkillsForm onClose={handleCloseAddSoftSkillModal} onAddSuccess={handleAddSoftSkillSuccess} existingSkillNames={softSkills.map(s => s.name)}/>}
        {isAddHardSkillModalOpen && <AddHardSkillsForm onClose={handleCloseAddHardSkillModal} onAddSuccess={handleAddHardSkillSuccess} existingSkillNames={hardSkills.map(s => s.name)}/>}
        {isAddPortfolioModalOpen && <AddPortfolioForm onClose={handleCloseAddPortfolioModal} onAddSuccess={handleAddPortfolioSuccess} />}
        {isEditPortfolioModalOpen && selectedPortfolio && <EditPortfolioForm initialData={selectedPortfolio} onClose={handleCloseEditPortfolioModal} onUpdateSuccess={handleUpdatePortfolioSuccess} />}
        {isAddDocumentModalOpen && <AddDocumentForm onClose={handleCloseAddDocumentModal} onAddSuccess={handleAddDocumentSuccess} />}
        {isEditDocumentModalOpen && selectedDocument && <EditDocumentForm initialData={selectedDocument} onClose={handleCloseEditDocumentModal} onUpdateSuccess={handleUpdateDocumentSuccess} />}
        {isAddPreferenceModalOpen && <AddPreferenceForm onClose={handleCloseAddPreferenceModal} onSaveSuccess={handleAddPreferenceSuccess} />}
        {isEditPreferenceModalOpen && preferences && <EditPreferenceForm initialData={preferences} onClose={handleCloseEditPreferenceModal} onUpdateSuccess={handleUpdatePreferenceSuccess} />}
      </main>
      <Footer />
    </div>
  );
};

export default EditProfilePage;