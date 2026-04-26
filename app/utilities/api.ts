// api.ts
import type { FormData } from './useStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://app-server.sifely.com'
    : 'https://dev-app-server.sifely.com');

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Request failed: ${res.status} - ${errorText}`);
  }
  return res.json();
}

export const api = {

  async getActivity(eventId: string) {
    const url = `${BASE_URL}/activity/${eventId}`;
    return request<any>(url);
  },

  async getMemberPassword(memberId: string) {
    const url = `${BASE_URL}/sysAppActivityMember/password/${memberId}`;
    return request<any>(url);
  },

  async applyMember(data: FormData) {
    const url = `${BASE_URL}/sysAppActivityMember/apply`;
    return request<any>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
