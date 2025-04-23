import { create } from 'zustand';
import { api } from "~/utilities/api";

type EventData = {
  id: string;
  uid: number;
  lockId: number;
  name: string;
  isAllDay: number;
  timezone: number;
  timezoneInfo: string | null;
  limits: number;
  startTime: number;
  endTime: number;
  reminder: null;
  alarmReminder: null;
  isDelete: number;
  updateTime: null;
  createTime: number;
  memberCount: number;
  location: string;
  descriptions: string;
  nickName: string;
  contactInfo: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobile: string;
  activityId: string;
}

type LoadingStore = {
  isLoading: boolean;
  data: EventData | null;
  // memberId: string | null;
  memberInfo: any | null;
  fetchActivityInfo: (eventId: string) => Promise<void>;
  handleSubmit: (formData: FormData) => Promise<string | undefined>;
  fetchMemberInfo: (memberId: string) => Promise<boolean>;
};

export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  data: null,
  // memberId: null,
  memberInfo: null,
  fetchActivityInfo: async (eventId: string) => {
    set({ isLoading: true })
    try {
      const res = await api.getActivity(eventId)
      if (res.code !== 200) throw new Error(res.msg);
      // if (res.code !== 200) throw new Error('Network issue');
      set({ data: res.data });
    } catch (error: any) {
      alert(error.message)
    } finally {
      set({ isLoading: false });
    }
  },
  handleSubmit: async (formData) => {
    set({ isLoading: true })
    try {
      const res = await api.applyMember(formData)
      if (res.code !== 200) throw new Error(res.msg);
      // if (!res.data.id) throw new Error('Missing memberId')
      localStorage.setItem(formData.activityId, res.data.id);
      // set({ memberId: res.data.id });
      return res.data.id
    } catch (error: Error | any) {
      alert(error.message)
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMemberInfo: async (memberId) => {
    set({ isLoading: true })
    try {
      const res = await api.getMemberPassword(memberId);
      if (res.code !== 200) throw new Error(res.msg);
      set({ memberInfo: res.data });
      return res.data
    } catch (error: Error | any) {
      alert(error.message)
      set({ memberInfo: false });
      return false
    } finally {
      set({ isLoading: false });
    }
  },
}));
