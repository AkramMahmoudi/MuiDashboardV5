import type { Dispatch, SetStateAction } from 'react';

import axios from 'axios';

interface ProductPayload {
  name: string;
  price: number;
  sell_price: number;
  quantity: number;
  category_id: number;
}

interface UserPayload {
  name: string;
  username: string;
  password: string;
  phone: string;
  role: string;
  image: string | null;
}
interface FetchResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
}
interface PostResponse {
  [key: string]: any;
}
// Reusable fetch function
export const fetchData = async <T>(
  url: string,
  params: Record<string, any>
): Promise<FetchResponse<T>> => {
  try {
    const response = await axios.get<FetchResponse<T>>(url, { params });
    if (response.status === 200) {
      return response.data;
    }
    throw new Error(`Unexpected status code: ${response.status}`);

    // return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// deleteHandler.ts

interface DeleteHandlerParams {
  idToDelete: string | null;
  setSnackbarMessage: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<SetStateAction<'success' | 'error'>>;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  fetchFunction: () => void; // Function to refresh data after deletion
  apiEndpoint: string; // Base URL for deletion
  closeDialog: () => void; // Function to close the confirmation dialog
}

export const handleConfirmDelete = async ({
  idToDelete,
  setSnackbarMessage,
  setSnackbarSeverity,
  setSnackbarOpen,
  setLoading,
  fetchFunction,
  apiEndpoint,
  closeDialog,
}: DeleteHandlerParams) => {
  if (!idToDelete) return;

  try {
    setLoading(true);
    const response = await axios.delete(`${apiEndpoint}/${idToDelete}`);
    setSnackbarMessage(response.data as string);
    setSnackbarSeverity('success');
    fetchFunction(); // Refresh data after deletion
  } catch (error: any) {
    setSnackbarMessage(error.response?.data?.message || 'Failed to delete item.');
    setSnackbarSeverity('error');
  } finally {
    setLoading(false);
    setSnackbarOpen(true);
    closeDialog();
  }
};

export const postData = async (
  resource: string,
  params: Record<string, any>
): Promise<PostResponse> => {
  try {
    const response = await axios.post<PostResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/api/${resource}`,
      params
    );
    if (response.status === 200) {
      console.log(response.data.data);
      const TOKEN = response.data.data;
      localStorage.setItem('token', TOKEN);

      axios.defaults.headers.common.Authorization = `Bearer ${TOKEN}`;
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
export const putData = async (
  resource: string,
  params: Record<string, any>
): Promise<PostResponse> => {
  try {
    const response = await axios.put<PostResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/api/${resource}`,
      params
    );
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};
// for base64
// export const createEntity = async <T>(entity: string, payload: T) => {
//   const url = `${import.meta.env.VITE_API_BASE_URL}/api/${entity}`;
//   const response = await axios.post(url, payload);
//   return response;
// };

// export const updateEntity = async <T>(entity: string, id: string, payload: T) => {
//   const url = `${import.meta.env.VITE_API_BASE_URL}/api/${entity}/${id}`;
//   const response = await axios.put(url, payload);
//   return response;
// };

// for multipart type

export const createEntity = async <T>(entity: string, payload: T | FormData) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/api/${entity}`;
  const config =
    payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await axios.post(url, payload, config);
  return response;
};

export const updateEntity = async <T>(entity: string, id: string, payload: T | FormData) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/api/${entity}/${id}`;
  const config =
    payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await axios.put(url, payload, config);
  return response;
};
