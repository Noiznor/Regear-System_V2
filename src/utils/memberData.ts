import { useState, useEffect } from 'react';
import { MemberData, MemberRole } from '../types';

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
export const saveMemberData = (memberName: string, role: MemberRole, tier: number): void => {
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
    saveMemberData(memberName, role, tier);
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