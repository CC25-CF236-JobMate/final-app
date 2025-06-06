// src/services/experienceService.ts
import { auth } from '../services/firebase'; // Your Firebase auth instance
import { FieldValue } from "firebase/firestore"; // Firestore type

const API_BASE_URL = 'https://jobseeker-capstone-705829099986.asia-southeast2.run.app';

export interface ExperienceData {
  id?: string; // Optional: for existing records
  position: string;
  company: string;
  description: string;
  employmentType: 'full-time' | 'part-time' | 'freelance' | 'internship' | 'contract' | string; // Allow string for initial input
  startDate: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD or null
  createdAt?: Date | FieldValue | string;
  updatedAt?: Date | FieldValue | string;
}

export const validEmploymentTypes = ['full-time', 'part-time', 'freelance', 'internship', 'contract'] as const;
export type EmploymentType = typeof validEmploymentTypes[number];


// Helper function to get the ID token
const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Add new experience record
export const addExperience = async (experienceData: Omit<ExperienceData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExperienceData> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const payload = {
    ...experienceData,
    employmentType: experienceData.employmentType.toLowerCase(),
  };

  const response = await fetch(`${API_BASE_URL}/experience`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to add experience and parse error' }));
    console.error('Add experience error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to add experience. Status: ${response.status}`);
  }
  const result = await response.json();
  return result.experience as ExperienceData; 
};

// Get all experience records for the user
export const getExperience = async (): Promise<ExperienceData[]> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/experience`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to get experience and parse error' }));
    console.error('Get experience error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to get experience. Status: ${response.status}`);
  }
  const result = await response.json();
  return result.experience as ExperienceData[];
};

// Update an existing experience record
export const updateExperience = async (id: string, experienceData: Partial<Omit<ExperienceData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ExperienceData> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  if (!id) {
    throw new Error('Experience ID is required for update.');
  }
  
  const payload = { ...experienceData };
  if (payload.employmentType) {
    payload.employmentType = payload.employmentType.toLowerCase();
  }


  const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to update experience and parse error' }));
    console.error('Update experience error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to update experience. Status: ${response.status}`);
  }
  const result = await response.json();
  return result.experience as ExperienceData;
};

// Delete an experience record
export const deleteExperience = async (id: string): Promise<{ message: string }> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  if (!id) {
    throw new Error('Experience ID is required for deletion.');
  }

  const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to delete experience and parse error' }));
    console.error('Delete experience error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to delete experience. Status: ${response.status}`);
  }
  return response.json();
};
