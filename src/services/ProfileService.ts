// src/services/profileService.ts
import { auth } from '../services/firebase'; // Your Firebase auth instance

const API_BASE_URL = 'https://jobseeker-capstone-705829099986.asia-southeast2.run.app';

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
  // Add any other fields that your profile might have
}

// Helper function to get the ID token
const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Fetch user profile
export const fetchProfile = async (): Promise<ProfileData> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch profile and parse error' }));
    console.error('Fetch profile error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to fetch profile. Status: ${response.status}`);
  }
  return response.json();
};

// Update user profile
export const updateProfile = async (profileData: Partial<ProfileData>): Promise<any> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  // Filter out undefined values from profileData, except for photoUrl which can be null
  const dataToUpdate: Partial<ProfileData> = {};
  for (const key in profileData) {
    if (Object.prototype.hasOwnProperty.call(profileData, key)) {
      const typedKey = key as keyof ProfileData;
      if (profileData[typedKey] !== undefined) {
        dataToUpdate[typedKey] = profileData[typedKey];
      }
    }
  }
  
  if (Object.keys(dataToUpdate).length === 0) {
    console.warn("No data provided to update profile.");
    return { message: "No data provided to update." };
  }

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToUpdate),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to update profile and parse error' }));
    console.error('Update profile error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to update profile. Status: ${response.status}`);
  }
  return response.json();
};

// Delete profile photo
export const deleteProfilePhoto = async (): Promise<any> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/profile/photo`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to delete photo and parse error' }));
    console.error('Delete photo error:', response.status, errorData);
    throw new Error(errorData.error || `Failed to delete profile photo. Status: ${response.status}`);
  }
  return response.json();
};
