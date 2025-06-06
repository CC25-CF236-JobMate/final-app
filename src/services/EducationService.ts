// src/services/educationService.ts
import { auth } from '../services/firebase'; // Your Firebase auth instance
import { FieldValue } from "firebase/firestore"; // This is a Firestore type, ensure it's used correctly or handled if backend uses it

const API_BASE_URL = 'https://jobseeker-capstone-705829099986.asia-southeast2.run.app';

export interface EducationData {
  id?: string; // Optional: for existing records
  level: string;
  institution: string;
  major: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD or null
  gpa?: number | string | null; // GPA can be string for input, number for processing
  createdAt?: Date | FieldValue | string; // Firestore FieldValue for server timestamp
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

// Add new education record
export const addEducation = async (educationData: Omit<EducationData, 'id' | 'createdAt' | 'updatedAt'>): Promise<EducationData> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/education`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(educationData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to add education and parse error' }));
    console.error('Add education error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to add education. Status: ${response.status}`);
  }
  const result = await response.json();
  return result.education as EducationData; // Backend returns the created education object with id
};

// Get all education records for the user
export const getEducation = async (): Promise<EducationData[]> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/education`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to get education and parse error' }));
    console.error('Get education error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to get education. Status: ${response.status}`);
  }
  const result = await response.json();
  return result.education as EducationData[];
};

// Update an existing education record
export const updateEducation = async (id: string, educationData: Partial<Omit<EducationData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<EducationData> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  if (!id) {
    throw new Error('Education ID is required for update.');
  }

  const response = await fetch(`${API_BASE_URL}/education/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(educationData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to update education and parse error' }));
    console.error('Update education error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to update education. Status: ${response.status}`);
  }
  const result = await response.json();
  return result.education as EducationData;
};

// Delete an education record
export const deleteEducation = async (id: string): Promise<{ message: string }> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  if (!id) {
    throw new Error('Education ID is required for deletion.');
  }

  const response = await fetch(`${API_BASE_URL}/education/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to delete education and parse error' }));
    console.error('Delete education error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to delete education. Status: ${response.status}`);
  }
  return response.json();
};
