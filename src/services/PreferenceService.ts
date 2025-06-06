// src/services/preferenceService.ts
import { auth } from '../services/firebase'; // Your Firebase auth instance
import { FieldValue } from "firebase/firestore";

const API_BASE_URL = 'https://jobseeker-capstone-705829099986.asia-southeast2.run.app';

export const validJobTypes = ["Remote", "On-site", "Hybrid"] as const;
export type JobType = typeof validJobTypes[number];

export interface PreferenceData {
  id?: 'default';
  jobCategories: string[];
  locations: string[];
  salaryExpectation: number | null;
  jobTypes: JobType[];
  createdAt?: Date | FieldValue | string;
  updatedAt?: Date | FieldValue | string;
}

// Helper function to get the ID token
const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Add or Set user preferences
export const setPreferences = async (preferenceData: Omit<PreferenceData, 'id' | 'createdAt' | 'updatedAt'>): Promise<PreferenceData> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/preferences`, {
    method: 'POST', // The backend uses POST to set/create
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferenceData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to set preferences and parse error' }));
    console.error('Set preferences error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to set preferences. Status: ${response.status}`);
  }
  const result = await response.json();
  return result.preferences as PreferenceData; 
};

// Get user preferences
export const getPreferences = async (): Promise<{id: string, preferences: PreferenceData} | null> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/preferences`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return null; // Preferences not found, which is a valid state
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to get preferences and parse error' }));
    console.error('Get preferences error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to get preferences. Status: ${response.status}`);
  }
  return response.json();
};

// Update user preferences
export const updatePreferences = async (preferenceData: Partial<Omit<PreferenceData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<{ message: string }> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  
  const response = await fetch(`${API_BASE_URL}/preferences`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferenceData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to update preferences and parse error' }));
    console.error('Update preferences error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to update preferences. Status: ${response.status}`);
  }
  return response.json();
};

// You might need a master list of job categories and locations.
// Similar to skills, these should ideally come from backend endpoints.

export const fetchMasterJobCategories = async (): Promise<string[]> => {
    // Placeholder implementation
    console.warn("fetchMasterJobCategories: Using placeholder data.");
    return Promise.resolve(["Teknologi Informasi", "Pemasaran", "Keuangan", "Desain Grafis", "Sumber Daya Manusia", "Penjualan"]);
};

export const fetchMasterLocations = async (): Promise<string[]> => {
    // Placeholder implementation
    console.warn("fetchMasterLocations: Using placeholder data.");
    return Promise.resolve(["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Bali", "Medan", "Makassar", "Remote"]);
};
