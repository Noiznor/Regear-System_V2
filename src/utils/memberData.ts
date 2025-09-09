import { useState, useEffect } from 'react';
import { MemberData, MemberRole } from '../types';

// API base URL - change this to your server URL in production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production
  : 'http://localhost:3001'; // Development server

// Check if we should use API or localStorage
const USE_API = process.env.NODE_ENV === 'production' || window.location.port === '3001';

const MEMBER_DATA_KEY = 'maharlika_member_data';

let cachedMembers: MemberData[] | null = null;

// Load member data from localStorage
const loadMemberDataFromStorage = (): Record<string, { role: MemberRole; tier: number }> => {
  const stored = localStorage.getItem(MEMBER_DATA_KEY);
  if (!stored) return {};
  
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
};

// Save member data to localStorage
export const saveMemberData = async (memberName: string, role: MemberRole, tier: number): Promise<void> => {
  if (USE_API) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/members/${encodeURIComponent(memberName)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, tier }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update member on server');
      }
      
      // Update cached members if they exist
      if (cachedMembers) {
        const memberIndex = cachedMembers.findIndex(m => m.name === memberName);
        if (memberIndex !== -1) {
          cachedMembers[memberIndex] = { ...cachedMembers[memberIndex], role, tier };
        }
      }
    } catch (error) {
      console.error('Error updating member via API:', error);
      // Fallback to localStorage
      saveMemberDataLocally(memberName, role, tier);
    }
  } else {
    saveMemberDataLocally(memberName, role, tier);
  }
};

// Local storage fallback
const saveMemberDataLocally = (memberName: string, role: MemberRole, tier: number): void => {
  const allMemberData = loadMemberDataFromStorage();
  allMemberData[memberName] = { role, tier };
  localStorage.setItem(MEMBER_DATA_KEY, JSON.stringify(allMemberData));
  
  // Update cached members if they exist
  if (cachedMembers) {
    const memberIndex = cachedMembers.findIndex(m => m.name === memberName);
    if (memberIndex !== -1) {
      cachedMembers[memberIndex] = { ...cachedMembers[memberIndex], role, tier };
    }
  }
};

export const loadMembers = async (): Promise<MemberData[]> => {
  if (cachedMembers) {
    return cachedMembers;
  }

  // Try to load from API first
  if (USE_API) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/members`);
      if (response.ok) {
        const members = await response.json();
        cachedMembers = members.sort((a: MemberData, b: MemberData) => a.name.localeCompare(b.name));
        return cachedMembers;
      }
    } catch (error) {
      console.error('Error loading members from API, falling back to CSV:', error);
    }
  }

  // Fallback to CSV loading
  try {
    const response = await fetch('/members.csv');
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const memberData = loadMemberDataFromStorage();
    
    const members: MemberData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(',');
        if (values.length >= 3 && values[0] && values[0] !== '#NAME?') {
          const memberName = values[0].trim();
          const storedData = memberData[memberName];
          
          members.push({
            name: memberName,
            id: values[1].trim(),
            guildName: values[2].trim(),
            role: storedData?.role || 'villager',
            tier: storedData?.tier || 1
          });
        }
      }
    }
    
    cachedMembers = members.sort((a, b) => a.name.localeCompare(b.name));
    return cachedMembers;
  } catch (error) {
    console.error('Error loading members:', error);
    return [];
  }
};

export const useMembers = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers().then(memberList => {
      setMembers(memberList);
      setLoading(false);
    });
  }, []);

  const updateMember = (memberName: string, role: MemberRole, tier: number) => {
    saveMemberData(memberName, role, tier).then(() => {
      // Update local state after successful save
    }).catch(error => {
      console.error('Failed to update member:', error);
      alert('Failed to update member. Please try again.');
    });
    
    // Optimistically update the UI
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.name === memberName 
          ? { ...member, role, tier }
          : member
      )
    );
  };

  return { members, loading, updateMember };
};

export const filterMembers = (members: MemberData[], query: string): MemberData[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return members
    .filter(member => member.name.toLowerCase().includes(lowercaseQuery))
    .slice(0, 10); // Limit to 10 suggestions
};
