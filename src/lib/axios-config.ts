import axios from 'axios';
import { getSession } from 'next-auth/react';

// this is for the api client without the header
export const apiClientWithoutHeader = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

//use axios interceptor to add the token to the request that is present in the next auth session
export const apiClientWithClientHeader = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
apiClientWithClientHeader.interceptors.request.use(async (config) => {
  const session = await getSession();
  config.headers['Content-Type'] = 'application/json';

  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }

  if (session?.user?.jwt) {
    config.headers.Authorization = `Bearer ${session.user.jwt}`;
  }
  return config;
});
