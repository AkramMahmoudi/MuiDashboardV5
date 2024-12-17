import axios from 'axios';

interface FetchResponse<T> {
  data: T[];
  per_page: number;
  total: number;
}

// Reusable fetch function
export const fetchData = async <T>(
  url: string,
  page: number = 1,
  filter: string = ''
): Promise<FetchResponse<T>> => {
  try {
    const response = await axios.get<FetchResponse<T>>(
      `${url}?page=${page}&name=${filter}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
