// src/services/skillsService.ts
import { auth, db } from '../services/firebase'; // Your Firebase auth instance and Firestore db instance
import { collection, getDocs, FieldValue } from "firebase/firestore"; // Firestore imports

const API_BASE_URL = 'https://jobseeker-capstone-705829099986.asia-southeast2.run.app';

export interface Skill {
  id?: string; // ID unik untuk skill pengguna (dari subkoleksi pengguna)
  name: string; // Nama skill
  level: 'Pemula' | 'Menengah' | 'Mahir' | 'Ahli' | string;
  createdAt?: Date | FieldValue | string;
}

export const skillLevels: ReadonlyArray<Skill['level']> = ['Pemula', 'Menengah', 'Mahir', 'Ahli'];

// Helper function to get the ID token for API calls
const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// --- MASTER SKILL LISTS ---
export const fetchMasterSoftSkills = async (): Promise<Array<{ id: string, name: string }>> => {
  if (!auth.currentUser) {
    console.warn("User not authenticated. Cannot fetch master soft skills from Firestore directly.");
    return [];
  }
  try {
    // PERBAIKAN: Menggunakan nama koleksi dengan underscore
    const softSkillsColRef = collection(db, "soft_skills");
    const snapshot = await getDocs(softSkillsColRef);
    
    if (snapshot.empty) {
      console.warn("Tidak ada dokumen master soft skill yang ditemukan di Firestore collection '/soft_skills'.");
      return [];
    }
    
    const masterSkills = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || doc.id
    }));
    return masterSkills;

  } catch (error: any) {
    console.error("Error fetching master soft skills directly from Firestore:", error.message);
    return [];
  }
};

export const fetchMasterHardSkills = async (): Promise<Array<{ id: string, name: string }>> => {
  if (!auth.currentUser) {
    console.warn("User not authenticated. Cannot fetch master hard skills from Firestore directly.");
    return [];
  }
  try {
    // PERBAIKAN: Menggunakan nama koleksi dengan underscore
    const hardSkillsColRef = collection(db, "hard_skills");
    const snapshot = await getDocs(hardSkillsColRef);

    if (snapshot.empty) {
      console.warn("Tidak ada dokumen master hard skill yang ditemukan di Firestore collection '/hard_skills'.");
      return [];
    }

    const masterSkills = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || doc.id
    }));
    return masterSkills;

  } catch (error: any) {
    console.error("Error fetching master hard skills directly from Firestore:", error.message);
    return [];
  }
};


// --- USER'S SOFT SKILLS (menggunakan API backend) ---
export const getUserSoftSkills = async (): Promise<Skill[]> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');
  const response = await fetch(`${API_BASE_URL}/soft-skills`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Gagal mendapatkan soft skills pengguna' }));
    throw new Error(errorData.error || 'Gagal mendapatkan soft skills pengguna');
  }
  return response.json();
};

export const addSoftSkills = async (skills: Array<Omit<Skill, 'id' | 'createdAt'>>): Promise<{ message: string, addedSkills: Skill[] }> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');
  const response = await fetch(`${API_BASE_URL}/soft-skills`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skills),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Gagal menambahkan soft skills' }));
    throw new Error(errorData.error || 'Gagal menambahkan soft skills');
  }
  return response.json();
};

export const deleteSoftSkills = async (skillIds: string[]): Promise<{ message: string }> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');
  const response = await fetch(`${API_BASE_URL}/soft-skills`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ skillIds }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Gagal menghapus soft skills' }));
    throw new Error(errorData.error || 'Gagal menghapus soft skills');
  }
  return response.json();
};

// --- USER'S HARD SKILLS (menggunakan API backend) ---
export const getUserHardSkills = async (): Promise<Skill[]> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');
  const response = await fetch(`${API_BASE_URL}/hard-skills`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Gagal mendapatkan hard skills pengguna' }));
    throw new Error(errorData.error || 'Gagal mendapatkan hard skills pengguna');
  }
  return response.json();
};

export const addHardSkills = async (skills: Array<Omit<Skill, 'id' | 'createdAt'>>): Promise<{ message: string, addedSkills: Skill[] }> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');
  const response = await fetch(`${API_BASE_URL}/hard-skills`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skills),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Gagal menambahkan hard skills' }));
    throw new Error(errorData.error || 'Gagal menambahkan hard skills');
  }
  return response.json();
};

export const deleteHardSkills = async (skillIds: string[]): Promise<{ message: string }> => {
  const token = await getIdToken();
  if (!token) throw new Error('User not authenticated');
  const response = await fetch(`${API_BASE_URL}/hard-skills`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ skillIds }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Gagal menghapus hard skills' }));
    throw new Error(errorData.error || 'Gagal menghapus hard skills');
  }
  return response.json();
};
