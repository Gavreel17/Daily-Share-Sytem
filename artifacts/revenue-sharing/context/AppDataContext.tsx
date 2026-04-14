import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface Member {
  id: string;
  name: string;
  percentage: number;
  role: string;
}

export interface ShareRecord {
  memberId: string;
  memberName: string;
  percentage: number;
  amount: number;
}

export interface RevenueEntry {
  id: string;
  date: string;
  amount: number;
  isShared: boolean;
  shares: ShareRecord[];
  createdAt: string;
  createdBy: string;
}

interface AppDataContextType {
  members: Member[];
  revenueEntries: RevenueEntry[];
  addMember: (member: Omit<Member, "id">) => void;
  updateMember: (id: string, updates: Partial<Omit<Member, "id">>) => void;
  deleteMember: (id: string) => void;
  addRevenueEntry: (entry: Omit<RevenueEntry, "id" | "createdAt">) => void;
  deleteRevenueEntry: (id: string) => void;
  getTotalPercentage: () => number;
}

const SEED_MEMBERS: Member[] = [
  { id: "m1", name: "Alice Johnson", percentage: 40, role: "Director" },
  { id: "m2", name: "Bob Williams", percentage: 35, role: "Manager" },
  { id: "m3", name: "Carol Davis", percentage: 25, role: "Staff" },
];

const AppDataContext = createContext<AppDataContextType>({
  members: [],
  revenueEntries: [],
  addMember: () => {},
  updateMember: () => {},
  deleteMember: () => {},
  addRevenueEntry: () => {},
  deleteRevenueEntry: () => {},
  getTotalPercentage: () => 0,
});

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const storedMembers = await AsyncStorage.getItem("@members");
        const storedEntries = await AsyncStorage.getItem("@revenue_entries");
        setMembers(storedMembers ? JSON.parse(storedMembers) : SEED_MEMBERS);
        setRevenueEntries(storedEntries ? JSON.parse(storedEntries) : []);
      } catch {}
    };
    load();
  }, []);

  const saveMembers = async (data: Member[]) => {
    setMembers(data);
    await AsyncStorage.setItem("@members", JSON.stringify(data));
  };

  const saveEntries = async (data: RevenueEntry[]) => {
    setRevenueEntries(data);
    await AsyncStorage.setItem("@revenue_entries", JSON.stringify(data));
  };

  const addMember = useCallback((member: Omit<Member, "id">) => {
    const newMember: Member = {
      ...member,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setMembers((prev) => {
      const updated = [...prev, newMember];
      AsyncStorage.setItem("@members", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateMember = useCallback((id: string, updates: Partial<Omit<Member, "id">>) => {
    setMembers((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));
      AsyncStorage.setItem("@members", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteMember = useCallback((id: string) => {
    setMembers((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      AsyncStorage.setItem("@members", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addRevenueEntry = useCallback((entry: Omit<RevenueEntry, "id" | "createdAt">) => {
    const newEntry: RevenueEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setRevenueEntries((prev) => {
      const updated = [newEntry, ...prev];
      AsyncStorage.setItem("@revenue_entries", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteRevenueEntry = useCallback((id: string) => {
    setRevenueEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      AsyncStorage.setItem("@revenue_entries", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getTotalPercentage = useCallback(() => {
    return members.reduce((sum, m) => sum + m.percentage, 0);
  }, [members]);

  return (
    <AppDataContext.Provider
      value={{
        members,
        revenueEntries,
        addMember,
        updateMember,
        deleteMember,
        addRevenueEntry,
        deleteRevenueEntry,
        getTotalPercentage,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
