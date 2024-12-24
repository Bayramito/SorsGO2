import axios from 'axios';
import {getAccessToken} from '../utils/storage';

const BASE_URL = 'https://www2.sors.com.tr/API';

export const getDashboard = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${BASE_URL}/user/dashboard/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Dashboard error:', error);
    throw error;
  }
};

export const getAssignments = async () => {
  try {
    const accessToken = await getAccessToken();
    console.log('accessToken:', accessToken);
    const response = await axios.get(`${BASE_URL}/getassignments/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('getAssignments response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting assignments:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export const getAssignmentDetail = async assignmentId => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${BASE_URL}/getAssignmentDetail/`,
      {
        aid: assignmentId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log('Assignment detail response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignment detail:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};
export const searchAssignments = async searchTerm => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${BASE_URL}/searchAssignments/`,
      {
        ara: searchTerm,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error searching assignments:', error);
    throw error;
  }
};

export const saveAssignmentLocation = async (
  assignmentId,
  latitude,
  longitude,
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${BASE_URL}/saveAssingmentLocation/`,
      {
        aid: assignmentId,
        lat: latitude,
        lng: longitude,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log('saveAssignmentLocation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving assignment location:', error);
    throw error;
  }
};

export const registerDevice = async deviceInfo => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${BASE_URL}/registerdevice/`,
      deviceInfo,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error registering device:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${BASE_URL}/user/profile/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};
