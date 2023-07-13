import { FetchOptions } from "ohmyfetch";
import { useAuthStore } from "~~/store/auth";

const useCustomFetch = () => {
  const baseURL = "http://localhost:8080/api/";
  return async <T>(url: string, options: FetchOptions): Promise<T> => {
    const headers: HeadersInit = {};
    const token = useAuthStore()?.tokens?.access?.token;
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
      // @ts-ignore
      return await $fetch<T>(url, {
        baseURL,
        ...options,
        headers: {
          ...headers,
        },
      });
    } catch (err: any) {
      throw err;
    }
  };
};

export default useCustomFetch;
