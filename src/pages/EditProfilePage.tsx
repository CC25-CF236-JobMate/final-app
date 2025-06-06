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
import PreferenceList from '../components/List/PreferencesList'; // Import PreferenceList
import AddPreferenceForm from '../components/AddForm/AddPreferencesForm'; // Import AddPreferenceForm
import EditPreferenceForm from '../components/EditForm/EditPreferenceForm'; // Import EditPreferenceForm

import { fetchProfile } from '../services/ProfileService';
import { getEducation, type EducationData, deleteEducation } from '../services/EducationService';
import { getExperience, type ExperienceData, deleteExperience } from '../services/ExperienceService';
import { getUserSoftSkills, getUserHardSkills, deleteSoftSkills, deleteHardSkills, type Skill } from '../services/SkillsService';
import { getPortfolioProjects, type PortfolioProject, deletePortfolioProject } from '../services/PortfolioService';
import { getDocuments, type DocumentData as UserDocumentData, deleteDocument } from '../services/DocumentService';
import { getPreferences, type PreferenceData } from '../services/PreferenceService'; // Import preference services

import { ChevronLeft, User, BookText, Briefcase as BriefcaseIcon, Star, Layers as LayersIcon, FileText as FileTextIcon, Target as TargetIcon } from 'lucide-react'; // Added TargetIcon
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

type ActiveTab = 'profile' | 'education' | 'experience' | 'skills' | 'portfolio' | 'documents' | 'preferences'; // Add 'preferences' tab

const EditProfilePage: React.FC = () => {
  // All other states...
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

  // Preferences State
  const [preferences, setPreferences] = useState<PreferenceData | null>(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const [isAddPreferenceModalOpen, setIsAddPreferenceModalOpen] = useState(false);
  const [isEditPreferenceModalOpen, setIsEditPreferenceModalOpen] = useState(false);


  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  // Data Fetching Callbacks (including new one for preferences)
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

  // All other handlers...
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
  const handleAddPreferenceSuccess = () => loadPreferencesData(); // POST overwrites, so just reload
  const handleOpenEditPreferenceModal = () => { if (preferences) setIsEditPreferenceModalOpen(true); else handleOpenAddPreferenceModal(); /* If no prefs, open Add form instead */ };
  const handleCloseEditPreferenceModal = () => setIsEditPreferenceModalOpen(false);
  const handleUpdatePreferenceSuccess = () => loadPreferencesData(); // PATCH updates, so reload


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Pengaturan Akun</h1>
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors group py-2 px-3 rounded-lg hover:bg-blue-50"
          >
            <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Beranda 
          </Link>
        </div>

        <div className="mb-6 border-b border-gray-300">
          <nav className="-mb-px flex space-x-6 overflow-x-auto pb-px" aria-label="Tabs">
            {[
              { id: 'profile', label: 'Profil Saya', icon: User },
              { id: 'education', label: 'Pendidikan', icon: BookText },
              { id: 'experience', label: 'Pengalaman', icon: BriefcaseIcon },
              { id: 'skills', label: 'Keterampilan', icon: Star },
              { id: 'portfolio', label: 'Portfolio', icon: LayersIcon },
              { id: 'documents', label: 'Dokumen', icon: FileTextIcon },
              { id: 'preferences', label: 'Preferensi', icon: TargetIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
                  ${activeTab === tab.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400'}`}
              >
                <tab.icon size={16} className="mr-2" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white p-0 shadow-2xl rounded-xl overflow-hidden">
          {activeTab === 'profile' && <ProfileList profile={currentProfile} isLoading={isLoadingProfile} error={profileError} onEditClick={handleOpenEditProfileModal} />}
          {activeTab === 'education' && <div className="p-6 md:p-8"><EducationList educationRecords={educationList} isLoading={isLoadingEducation} error={educationError} onAddClick={handleOpenAddEducationModal} onEditClick={handleOpenEditEducationModal} onDeleteClick={handleDeleteEducation} /></div>}
          {activeTab === 'experience' && <div className="p-6 md:p-8"><ExperienceList experienceRecords={experienceList} isLoading={isLoadingExperience} error={experienceError} onAddClick={handleOpenAddExperienceModal} onEditClick={handleOpenEditExperienceModal} onDeleteClick={handleDeleteExperience} /></div>}
          {activeTab === 'skills' && <div className="p-6 md:p-8"><SkillsList softSkills={softSkills} hardSkills={hardSkills} isLoadingSoft={isLoadingSoftSkills} isLoadingHard={isLoadingHardSkills} errorSoft={softSkillsError} errorHard={hardSkillsError} onAddSoftSkillClick={handleOpenAddSoftSkillModal} onAddHardSkillClick={handleOpenAddHardSkillModal} onDeleteSoftSkill={handleDeleteSoftSkill} onDeleteHardSkill={handleDeleteHardSkill} /></div>}
          {activeTab === 'portfolio' && <div className="p-6 md:p-8"><PortfolioList portfolioProjects={portfolioProjects} isLoading={isLoadingPortfolio} error={portfolioError} onAddClick={handleOpenAddPortfolioModal} onEditClick={handleOpenEditPortfolioModal} onDeleteClick={handleDeletePortfolio} /></div>}
          {activeTab === 'documents' && <div className="p-6 md:p-8"><DocumentList documents={userDocuments} isLoading={isLoadingDocuments} error={documentsError} onAddClick={handleOpenAddDocumentModal} onEditClick={handleOpenEditDocumentModal} onDeleteClick={handleDeleteDocument} /></div>}
          {activeTab === 'preferences' && <div className="p-6 md:p-8"><PreferenceList preferences={preferences} isLoading={isLoadingPreferences} error={preferencesError} onAddClick={handleOpenAddPreferenceModal} onEditClick={handleOpenEditPreferenceModal} /></div>}
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
