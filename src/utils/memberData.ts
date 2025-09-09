import { useState, useEffect } from 'react';
import { MemberData, MemberRole } from '../types';

// 🔹 Always use Railway API (from .env)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let cachedMembers: MemberData[] | null = null;

// ---------------- API Helpers ----------------
export const saveMemberData = async (
  memberName: string,
  role: MemberRole,
  tier: number
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/members/${encodeURIComponent(memberName)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, tier }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update member on server');
    }

    // Update cached list
    if (cachedMembers) {
      const idx = cachedMembers.findIndex((m) => m.name === memberName);
      if (idx !== -1) {
        cachedMembers[idx] = { ...cachedMembers[idx], role, tier };
      }
    }
  } catch (error) {
    console.error('Error updating member via API:', error);
    throw error;
  }
};

export const loadMembers = async (): Promise<MemberData[]> => {
  if (cachedMembers) return cachedMembers;

  try {
    const response = await fetch(`${API_BASE_URL}/api/members`);
    if (response.ok) {
      const members = await response.json();
      cachedMembers = members.sort((a: MemberData, b: MemberData) =>
        a.name.localeCompare(b.name)
      );
      return cachedMembers;
    }
    throw new Error('Failed to load members from server');
  } catch (error) {
    console.error('Error loading members:', error);
    return [];
  }
};

// ---------------- Hook ----------------
export const useMembers = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers().then((memberList) => {
      setMembers(memberList);
      setLoading(false);
    });
  }, []);

  const updateMember = (memberName: string, role: MemberRole, tier: number) => {
    saveMemberData(memberName, role, tier)
      .then(() => {
        // success handled by optimistic update
      })
      .catch((error) => {
        console.error('Failed to update member:', error);
        alert('Failed to update member. Please try again.');
      });

    // Optimistic UI
    setMembers((prev) =>
      prev.map((m) =>
        m.name === memberName ? { ...m, role, tier } : m
      )
    );
  };

  return { members, loading, updateMember };
};

// ---------------- Autocomplete ----------------
export const filterMembers = (
  members: MemberData[],
  query: string
): MemberData[] => {
  if (!query.trim()) return [];
  const lowercaseQuery = query.toLowerCase();
  return members
    .filter((m) => m.name.toLowerCase().includes(lowercaseQuery))
    .slice(0, 10);
};
